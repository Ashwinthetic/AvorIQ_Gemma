"""
AvorIQ Backend — Chat Router
AI-powered scholarship chat with RAG (Retrieval-Augmented Generation).
Uses pgvector semantic search + Gemma 3 4B via Ollama.
"""

import json
import logging
import re
import base64
import io
from pypdf import PdfReader
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas import ChatRequest, ChatResponse
from app.services import ollama_service
from app.services.vector_service import search_similar

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["chat"])

SYSTEM_PROMPT = """You are AvorIQ AI, an intelligent scholarship assistant for Indian students. Your role is to help students find scholarships they are eligible for.

IMPORTANT RULES:
1. Answer ONLY based on the scholarship data provided in the context below. Do NOT make up scholarship names, amounts, or details.
2. If the context contains relevant scholarships, describe them clearly with name, provider, amount, eligibility, and deadline.
3. If no matching scholarships are found in the context, say so honestly and suggest the student try different search criteria.
4. Be encouraging and supportive — many students depend on this information.
5. Keep responses concise but informative. Use bullet points for readability.
6. When mentioning amounts, use Indian Rupee format (₹).
7. If the student asks about something unrelated to scholarships/education, politely redirect them.
8. If a student profile is provided, use it to highlight which scholarships they specifically qualify for.
9. Speak naturally and confidently as an expert advisor. Do NOT mention 'the context', 'instructions', 'rules', or say things like 'based on the provided data' or 'as per your instructions'. Just answer the student's question directly and naturally using the information.

RESPONSE STYLE:
- When a student asks about SPECIFIC details (documents needed, eligibility criteria, deadlines, selection process, FAQs) about a scholarship that appears in the context, answer that specific question directly. Do NOT re-list all scholarships.
- When a student is SEARCHING for scholarships (e.g., "find scholarships for engineering", "show me scholarships for girls"), then list the matching scholarships with key details.
- For greetings or general questions, respond conversationally and offer to help find scholarships.
"""


def _classify_query_intent(message: str) -> str:
    """
    Classify whether the user is searching for scholarships or asking a
    follow-up / detail question about a specific scholarship.
    
    Returns:
        'search'   — user wants to find/list scholarships
        'detail'   — user is asking about a specific scholarship's details
        'greeting' — user is just greeting
        'general'  — general question about scholarships
    """
    q = message.lower().strip()

    # Greeting detection
    greetings = ["hi", "hello", "hey", "hola", "greetings", "good morning",
                 "good afternoon", "good evening", "namaste", "thanks", "thank you"]
    if any(q == g or q.startswith(g + " ") or q.startswith(g + ",") or q.startswith(g + "!") for g in greetings):
        return "greeting"

    # Search / Discovery patterns — user wants to find/list/compare scholarships
    # We check these FIRST so that general queries like "Which scholarship requires least documents" 
    # are treated as search queries instead of specific detail questions.
    search_patterns = [
        r"\b(find|search|show|list|suggest|recommend|compare|tell\s+me\s+about)\b.*\bscholarships?\b",
        r"\b(find|search|show|list|suggest|recommend|compare|tell\s+me)\b",
        r"\bscholarships?\s+(for|available|open|require|with|have)",
        r"\b(any|best|top|which|what|some)\s+scholarships?\b",
        r"\b(i\s+am|i'm|i\s+need)\b.*\bscholarship",
        r"\b(least|fewest|minimum|most|maximum|highest|lowest)\b.*\b(document|income|mark|percent|eligib)",
    ]
    for pattern in search_patterns:
        if re.search(pattern, q):
            return "search"

    # Detail / follow-up patterns — asking about specifics of a single scholarship
    detail_patterns = [
        r"\bdocument",        # "what documents do I need"
        r"\beligib",          # "am I eligible", "eligibility criteria"
        r"\bhow to apply",    # "how to apply for"
        r"\bapplication\s*(process|procedure|form)",
        r"\bselection\s*(process|criteria)",
        r"\bdeadline",        # "what's the deadline"
        r"\blast date",
        r"\brequire",         # "what are the requirements"
        r"\bfaq",             # FAQ questions
        r"\bbenefits?\b",     # "what are the benefits"
        r"\bcoverage",        # "what does it cover"
        r"\brenew",           # "is it renewable"
        r"\brepay",           # "when do I repay"
        r"\bmore\s*(info|about|detail)",  # "tell me more about"
        r"\bexplain",         # "explain this scholarship"
        r"\bwhat\s+is\s+the\s+(amount|stipend|fee)",
        r"\bcan\s+i\s+apply",
        r"\bam\s+i\s+eligible",
        r"\bhow\s+much",      # "how much does it pay"
    ]
    for pattern in detail_patterns:
        if re.search(pattern, q):
            return "detail"

    # Default: if the message mentions specific scholarship names, it's probably a detail question
    # Otherwise treat as a general search
    return "general"


def _build_context(scholarships: list[dict], profile: dict | None) -> str:
    """Build the RAG context string from retrieved scholarships."""
    if not scholarships:
        return "No scholarships found matching this query."

    context_parts = ["Here are the relevant scholarships from the database:\n"]
    for i, item in enumerate(scholarships, 1):
        s = item["scholarship"]
        elig = s.get("eligibility", {})
        score = item.get("similarity_score", "N/A")
        context_parts.append(f"""
---
**Scholarship {i}: {s['name']}**
- Provider: {s['provider']}
- Amount: {s['amountFormatted']}
- Deadline: {s['deadline']}
- Category: {s['category']}
- Status: {s['status']}
- Education Levels: {', '.join(elig.get('educationLevel', []))}
- Gender: {elig.get('gender', 'All')}
- Max Family Income: ₹{elig.get('familyIncomeMax', 0):,} {'(no limit)' if elig.get('familyIncomeMax', 0) == 0 else ''}
- States: {', '.join(elig.get('states', []))}
- Castes/Categories: {', '.join(elig.get('castes', []))}
- Fields of Study: {', '.join(elig.get('fieldsOfStudy', []))}
- Description: {s['description']}
- Benefits: {s['benefits']}
- Coverage: {s['coverage']}
- Selection: {s['selectionProcess']}
- Documents: {', '.join(s.get('documents', []))}
- Official Link: {s['officialLink']}
- Relevance Score: {score}
""")

    if profile:
        context_parts.append("\n--- STUDENT PROFILE ---")
        if profile.get("educationLevel"):
            context_parts.append(f"Education Level: {profile['educationLevel']}")
        if profile.get("gender"):
            context_parts.append(f"Gender: {profile['gender']}")
        if profile.get("familyIncomeMax") is not None:
            context_parts.append(f"Family Income: ₹{profile['familyIncomeMax']:,}")
        if profile.get("state"):
            context_parts.append(f"State: {profile['state']}")
        if profile.get("caste"):
            context_parts.append(f"Category: {profile['caste']}")

    return "\n".join(context_parts)


def _find_mentioned_scholarships(message: str, scholarships: list[dict]) -> list[dict]:
    """
    Check if the user's message explicitly mentions words from the scholarship name or provider.
    Returns only the matching scholarships.
    """
    msg = message.lower()
    matches = []
    
    for item in scholarships:
        s = item["scholarship"]
        name = s["name"].lower()
        provider = s["provider"].lower()
        s_id = s["id"].lower()
        
        # 1. Direct ID token check (e.g. "nmms", "csss", "hdfc", "loreal", "mahadbt", "ongc", "yasasvi")
        id_tokens = s_id.split("-")
        has_id_match = False
        for token in id_tokens:
            if len(token) > 2:
                pattern = rf"\b{re.escape(token)}\b"
                if re.search(pattern, msg):
                    has_id_match = True
                    break
        if has_id_match:
            matches.append(item)
            continue
            
        # 2. Brand/Common names keywords mapping
        brand_keywords = []
        if "nmms" in name or "means-cum-merit" in name: brand_keywords.extend(["nmms", "means-cum-merit", "means cum merit"])
        if "csss" in name or "central sector" in name: brand_keywords.extend(["csss", "central sector"])
        if "hdfc" in name: brand_keywords.append("hdfc")
        if "loreal" in name or "l'oreal" in name: brand_keywords.extend(["loreal", "l'oreal"])
        if "tata" in name or "pankh" in name: brand_keywords.extend(["tata", "pankh"])
        if "pragati" in name: brand_keywords.append("pragati")
        if "mp postmatric" in name or "madhya pradesh" in name or "post-matric" in name: brand_keywords.extend(["mp", "postmatric", "post-matric"])
        if "mahadbt" in name or "shahu maharaj" in name: brand_keywords.extend(["mahadbt", "shahu"])
        if "colgate" in name or "keep india smiling" in name: brand_keywords.extend(["colgate", "keep india smiling"])
        if "sahu jain" in name: brand_keywords.extend(["sahu", "jain"])
        if "lic" in name: brand_keywords.append("lic")
        if "aditya birla" in name or "abc" in name: brand_keywords.extend(["aditya", "birla"])
        if "ongc" in name: brand_keywords.append("ongc")
        if "kotak" in name or "kanya" in name: brand_keywords.extend(["kotak", "kanya"])
        if "reliance" in name: brand_keywords.append("reliance")
        if "sbi" in name or "asha" in name: brand_keywords.extend(["sbi", "asha"])
        if "commonwealth" in name: brand_keywords.append("commonwealth")
        if "yasasvi" in name: brand_keywords.append("yasasvi")
        if "gate" in name or "aicte" in name: brand_keywords.extend(["gate", "aicte"])
        
        has_match = False
        for kw in brand_keywords:
            # Check for exact word boundaries to avoid matching substrings (e.g. "one" in "foundational")
            pattern = rf"\b{re.escape(kw)}\b"
            if re.search(pattern, msg):
                has_match = True
                break
                
        # 3. General word matching (excluding generic words) with exact word boundary checks
        if not has_match:
            words = [w.strip("(),.-/\\") for w in name.split()]
            for w in words:
                if len(w) <= 3:
                    continue
                if w in ["scholarship", "scheme", "national", "sector", "central", "means", "merit", "program", "programme", "fellowship", "students"]:
                    continue
                pattern = rf"\b{re.escape(w)}\b"
                if re.search(pattern, msg):
                    has_match = True
                    break
                    
        # 4. Provider name matching with exact word boundary checks
        if not has_match:
            p_words = [w.strip("(),.-/\\") for w in provider.split()]
            for w in p_words:
                if len(w) <= 3:
                    continue
                if w in ["ministry", "department", "government", "india", "limited", "foundation", "trust"]:
                    continue
                pattern = rf"\b{re.escape(w)}\b"
                if re.search(pattern, msg):
                    has_match = True
                    break
                    
        if has_match:
            matches.append(item)
            
    return matches


@router.post("")
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
):
    """
    AI chat endpoint with RAG pipeline:
    1. Classify query intent (search vs detail vs greeting)
    2. Semantic search for relevant scholarships
    3. Filter context & cards based on mentioned brand names
    4. Generate response with Gemma 3 4B
    """
    # Step 0: Classify the query intent
    intent = _classify_query_intent(request.message)
    logger.info(f"Chat query intent: '{intent}' for message: '{request.message[:80]}'")

    # Step 1: Retrieve relevant scholarships via vector search
    profile_dict = request.profile.model_dump() if request.profile else None
    
    use_active = False
    scholarships = []
    
    # Check if we can reuse the active cards from the previous turn as context
    if intent in ("detail", "general") and request.active_scholarships:
        use_active = True
        scholarships = [
            {"scholarship": s.model_dump() if hasattr(s, "model_dump") else s, "similarity_score": 1.0}
            for s in request.active_scholarships
        ]
        
    if not use_active:
        if intent == "greeting":
            scholarships = []
        else:
            scholarships = await search_similar(
                db,
                request.message,
                limit=5,
                profile=profile_dict,
            )

    # Step 2: Parse ordinal references (e.g. "first one", "3rd one", "last one")
    selected_index = None
    msg = request.message.lower()
    if re.search(r"\b(first|1st|first\s+one)\b", msg):
        selected_index = 0
    elif re.search(r"\b(second|2nd|second\s+one)\b", msg):
        selected_index = 1
    elif re.search(r"\b(third|3rd|third\s+one)\b", msg):
        selected_index = 2
    elif re.search(r"\b(fourth|4th|fourth\s+one)\b", msg):
        selected_index = 3
    elif re.search(r"\b(fifth|5th|fifth\s+one)\b", msg):
        selected_index = 4
    elif re.search(r"\b(last|last\s+one)\b", msg):
        selected_index = -1

    # Apply ordinal selection if valid
    index_selected = False
    if selected_index is not None and use_active and scholarships:
        try:
            idx = len(scholarships) - 1 if selected_index == -1 else selected_index
            if 0 <= idx < len(scholarships):
                scholarships = [scholarships[idx]]
                index_selected = True
        except Exception as e:
            logger.error(f"Ordinal selection error: {e}")

    # Step 3: Context and card filtering based on user message mentions
    show_cards = False
    cards_to_show = []
    filtered_scholarships = scholarships

    if intent != "greeting" and len(scholarships) > 0:
        # Check if a specific brand/scholarship is mentioned in the query
        mentioned = _find_mentioned_scholarships(request.message, scholarships)
        if mentioned:
            # User named a specific scholarship:
            # 1. Limit LLM context strictly to that scholarship (prevents distraction/hallucination)
            filtered_scholarships = mentioned
            # 2. Show only the matching card in the UI
            show_cards = True
            cards_to_show = mentioned
        elif index_selected:
            # User selected an ordinal item (e.g. "third one")
            # Show the card for that selected item
            show_cards = True
            cards_to_show = scholarships
        elif intent == "search":
            # General search query: show all matches in context and UI
            show_cards = True
            cards_to_show = scholarships

    # Process attached file if present
    pdf_text = ""
    is_image = False
    b64_content = None

    if request.file_base64:
        try:
            # Strip base64 prefix if present
            b64_data = request.file_base64
            if "," in b64_data:
                b64_data = b64_data.split(",", 1)[1]
            
            file_bytes = base64.b64decode(b64_data)
            
            # Determine if PDF or image
            is_pdf = False
            if request.file_type:
                is_pdf = "pdf" in request.file_type.lower()
            elif request.file_name:
                is_pdf = request.file_name.lower().endswith(".pdf")
                
            if is_pdf:
                # Extract text using pypdf
                pdf_reader = PdfReader(io.BytesIO(file_bytes))
                extracted_pages = []
                for page in pdf_reader.pages:
                    text = page.extract_text()
                    if text:
                        extracted_pages.append(text)
                pdf_text = "\n".join(extracted_pages)
                logger.info(f"Extracted {len(pdf_text)} characters from uploaded PDF: {request.file_name}")
            else:
                # Assume image (supported natively by Gemma 3 multimodal vision)
                is_image = True
                b64_content = b64_data
                logger.info(f"Received uploaded image: {request.file_name} for multimodal vision processing")
        except Exception as e:
            logger.error(f"Error processing attached file: {e}")
            pdf_text = f"[Error reading attached file: {e}]"

    # Step 3: Build RAG context using the filtered list
    context = _build_context(filtered_scholarships, profile_dict)
    if pdf_text:
        context += f"\n\n--- ADDITIONAL CONTEXT FROM ATTACHED PDF DOCUMENT ({request.file_name or 'Uploaded File'}) ---\n{pdf_text}\n--- END OF ATTACHED PDF DOCUMENT ---"

    # Step 4: Construct messages for Ollama
    intent_hint = ""
    if intent == "detail":
        intent_hint = "\n\nNote: The student is asking about SPECIFIC DETAILS of a scholarship. Answer their specific question directly without listing all scholarships."
    elif intent == "greeting":
        intent_hint = "\n\nNote: The student is greeting you. Respond warmly and offer to help them find scholarships."

    if request.file_base64:
        intent_hint += "\n\nNote: The student has attached a file. You are operating in HYBRID RAG mode: you should analyze and answer questions about the attached document/image contents alongside any database scholarships."

    sys_prompt = request.system_prompt if request.system_prompt else (SYSTEM_PROMPT + intent_hint)
    messages = [
        {"role": "system", "content": sys_prompt},
    ]

    if request.history:
        for msg in request.history:
            role = "assistant" if msg.role in ("ai", "assistant") else "user"
            messages.append({"role": role, "content": msg.content})

    user_message = {"role": "user", "content": f"CONTEXT:\n{context}\n\nSTUDENT QUESTION: {request.message}"}
    if is_image and b64_content:
        user_message["images"] = [b64_content]

    messages.append(user_message)

    # Step 5: Generate response
    if request.stream:
        return StreamingResponse(
            _stream_response(messages, cards_to_show, show_cards),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no",
            },
        )
    else:
        response_text = await ollama_service.chat_completion(messages, stream=False)
        scholarship_list = []
        if show_cards:
            scholarship_list = [
                {**item["scholarship"], "_similarityScore": item.get("similarity_score", 0)}
                for item in cards_to_show
            ]
        return ChatResponse(response=response_text, scholarships=scholarship_list)


async def _stream_response(messages: list[dict], scholarships: list[dict], show_cards: bool):
    """
    SSE streaming response generator.
    Sends tokens as they arrive, then sends matched scholarships only when appropriate.
    """
    try:
        # Only send scholarship cards when show_cards is active and we have matches
        if show_cards and scholarships:
            scholarship_data = []
            for item in scholarships[:3]:
                s = item["scholarship"]
                s["_similarityScore"] = item.get("similarity_score", 0)
                scholarship_data.append(s)
            yield f"data: {json.dumps({'type': 'scholarships', 'data': scholarship_data})}\n\n"
        else:
            # Send empty scholarships signal so frontend knows not to show cards
            yield f"data: {json.dumps({'type': 'scholarships', 'data': []})}\n\n"

        # Stream AI tokens
        stream_gen = await ollama_service.chat_completion(messages, stream=True)
        async for token in stream_gen:
            yield f"data: {json.dumps({'type': 'token', 'data': token})}\n\n"

        # Signal completion
        yield f"data: {json.dumps({'type': 'done'})}\n\n"

    except Exception as e:
        logger.error(f"Streaming error: {e}")
        yield f"data: {json.dumps({'type': 'error', 'data': str(e)})}\n\n"
