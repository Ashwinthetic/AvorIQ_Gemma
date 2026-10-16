"""
AvorIQ Backend — Vector Service
Embedding generation for scholarships and semantic similarity search via pgvector.

Accuracy improvements:
- Enhanced query preprocessing to extract search intent
- Minimum similarity threshold to filter irrelevant results
- Hybrid search: combine vector similarity with structured field matching
- Better text representations for embeddings
- Re-ranking with combined semantic + field-match scores
"""

import logging
import re
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import ScholarshipDB
from app.services.tei_service import generate_embedding

logger = logging.getLogger(__name__)

# Minimum cosine similarity to include a result (0.0 to 1.0)
# Results below this are too irrelevant to show
MIN_SIMILARITY_THRESHOLD = 0.3


def build_scholarship_text(scholarship: dict) -> str:
    """
    Build a rich text representation of a scholarship for embedding.

    This text is what gets converted to a 1024-dim vector by bge-m3.
    The richer and more structured it is, the better the search accuracy.
    """
    elig = scholarship.get("eligibility", {})
    
    # Build structured sections for better semantic matching
    parts = []
    
    # Identity section — what the scholarship IS
    parts.append(f"Scholarship: {scholarship['name']}.")
    parts.append(f"Provided by: {scholarship['provider']}.")
    parts.append(f"Category: {scholarship.get('category', '')}.")
    
    # Description — the most important semantic content
    desc = scholarship.get("description", "")
    if desc:
        parts.append(f"Description: {desc}")
    
    # Financial section
    parts.append(f"Scholarship amount: {scholarship.get('amountFormatted', '')}.")
    coverage = scholarship.get("coverage", "")
    if coverage:
        parts.append(f"What it covers: {coverage}.")
    benefits = scholarship.get("benefits", "")
    if benefits:
        parts.append(f"Benefits: {benefits}.")
    
    # Eligibility section — critical for matching
    ed_levels = elig.get("educationLevel", [])
    if ed_levels:
        parts.append(f"Eligible education levels: {', '.join(ed_levels)}.")
    
    gender = elig.get("gender", "All")
    if gender != "All":
        parts.append(f"This scholarship is exclusively for {gender} students.")
    else:
        parts.append("Open to all genders.")
    
    income_max = elig.get("familyIncomeMax", 0)
    if income_max and income_max > 0:
        parts.append(f"Maximum family income limit: ₹{income_max:,} per annum.")
    
    states = elig.get("states", [])
    if states and "All" not in states:
        parts.append(f"Available only in: {', '.join(states)}.")
    else:
        parts.append("Available across all states in India.")
    
    castes = elig.get("castes", [])
    if castes:
        parts.append(f"Open to caste categories: {', '.join(castes)}.")
    
    fields = elig.get("fieldsOfStudy", [])
    if fields and "All" not in fields:
        parts.append(f"For students studying: {', '.join(fields)}.")
    else:
        parts.append("Open to all fields of study.")
    
    # Process section
    selection = scholarship.get("selectionProcess", "")
    if selection:
        parts.append(f"Selection process: {selection}.")
    
    # Documents section
    docs = scholarship.get("documents", [])
    if docs:
        parts.append(f"Required documents: {', '.join(docs)}.")
    
    # FAQs — useful for detail queries
    faqs = scholarship.get("faqs", [])
    for faq in faqs:
        parts.append(f"FAQ: {faq.get('question', '')} Answer: {faq.get('answer', '')}")

    return " ".join(parts)


def _preprocess_search_query(query: str) -> str:
    """
    Enhance the user's query to improve embedding search accuracy.
    
    Problems with raw queries:
    - "scholarships for SC girls in MP" is too short for good embeddings
    - Abbreviations like "SC", "MP", "UG" may not embed well
    
    Solution: Expand abbreviations and add context words to help the
    embedding model understand the intent better.
    """
    q = query
    
    # Expand common abbreviations for better embedding quality
    expansions = {
        r'\bSC\b': 'Scheduled Caste SC',
        r'\bST\b': 'Scheduled Tribe ST',
        r'\bOBC\b': 'Other Backward Class OBC',
        r'\bEWS\b': 'Economically Weaker Section EWS',
        r'\bUG\b': 'Undergraduate UG bachelor degree',
        r'\bPG\b': 'Postgraduate PG master degree',
        r'\bMP\b': 'Madhya Pradesh MP',
        r'\bUP\b': 'Uttar Pradesh UP',
        r'\bAP\b': 'Andhra Pradesh AP',
        r'\bHP\b': 'Himachal Pradesh HP',
        r'\bJK\b': 'Jammu and Kashmir JK',
        r'\bTN\b': 'Tamil Nadu TN',
        r'\bWB\b': 'West Bengal WB',
        r'\bBTech\b': 'B.Tech Engineering BTech',
        r'\bMBBS\b': 'MBBS Medical Doctor',
        r'\bBSc\b': 'B.Sc Science BSc',
        r'\bBCom\b': 'B.Com Commerce BCom',
        r'\bBA\b': 'B.A Arts BA',
        r'\bMTech\b': 'M.Tech Engineering MTech',
        r'\bGATE\b': 'GATE Graduate Aptitude Test Engineering',
        r'\bAICTE\b': 'AICTE All India Council for Technical Education',
        r'\bNMMSS?\b': 'NMMS National Means Merit Scholarship',
        r'\bLIC\b': 'LIC Life Insurance Corporation',
    }
    
    for pattern, replacement in expansions.items():
        q = re.sub(pattern, replacement, q, flags=re.IGNORECASE)
    
    # Add "scholarship" context if not already present
    if "scholarship" not in q.lower():
        q = f"scholarship: {q}"
    
    return q


def _compute_field_match_score(scholarship: dict, query: str) -> float:
    """
    Compute a structured field-matching bonus score based on how well
    the scholarship's fields match keywords in the query.
    
    This supplements vector similarity with exact field matching
    for much better accuracy.
    
    Returns a bonus score between 0.0 and 0.35.
    """
    q = query.lower()
    elig = scholarship.get("eligibility", {})
    bonus = 0.0
    
    # Gender match (strong signal)
    if any(w in q for w in ["girl", "female", "women", "girls", "woman"]):
        if elig.get("gender") == "Female":
            bonus += 0.10  # Exact gender match
        elif elig.get("gender") == "All":
            bonus += 0.02  # Available but not specific
    elif any(w in q for w in ["boy", "male", "boys", "men"]):
        if elig.get("gender") == "All":
            bonus += 0.03
        elif elig.get("gender") == "Female":
            bonus -= 0.15  # Penalize female-only for male queries
    
    # Education level match
    ed_levels = elig.get("educationLevel", [])
    ed_keywords = {
        "ug": "UG", "undergraduate": "UG", "bachelor": "UG", "btech": "UG", "bsc": "UG",
        "pg": "PG", "postgraduate": "PG", "master": "PG", "mtech": "PG",
        "diploma": "Diploma",
        "class 6": "Class 6–10", "class 7": "Class 6–10", "class 8": "Class 6–10",
        "class 9": "Class 6–10", "class 10": "Class 6–10",
        "class 11": "Class 11–12", "class 12": "Class 11–12",
    }
    for keyword, level in ed_keywords.items():
        if keyword in q:
            if level in ed_levels or "All" in ed_levels:
                bonus += 0.08
            else:
                bonus -= 0.10  # Penalize wrong education level
            break
    
    # Field of study match
    field_keywords = {
        "engineering": "Engineering", "engineer": "Engineering", "btech": "Engineering",
        "computer": "Engineering", "tech": "Engineering",
        "medical": "Medical", "mbbs": "Medical", "doctor": "Medical", "nursing": "Medical",
        "science": "Science", "bsc": "Science",
        "commerce": "Commerce", "bcom": "Commerce", "accounting": "Commerce",
        "arts": "Arts", "humanities": "Arts",
        "law": "Law", "legal": "Law",
        "management": "Management", "mba": "Management",
    }
    fields = elig.get("fieldsOfStudy", [])
    for keyword, field in field_keywords.items():
        if keyword in q:
            if field in fields or "All" in fields:
                bonus += 0.07
            else:
                bonus -= 0.08  # Penalize wrong field
            break
    
    # State match
    states = elig.get("states", [])
    state_keywords = {
        "madhya pradesh": "Madhya Pradesh", "mp ": "Madhya Pradesh",
        "maharashtra": "Maharashtra",
        "uttar pradesh": "Uttar Pradesh",
        "rajasthan": "Rajasthan",
        "karnataka": "Karnataka",
        "tamil nadu": "Tamil Nadu",
        "kerala": "Kerala",
        "west bengal": "West Bengal",
        "bihar": "Bihar",
        "gujarat": "Gujarat",
    }
    for keyword, state in state_keywords.items():
        if keyword in q:
            if state in states:
                bonus += 0.10  # Direct state match
            elif "All" in states:
                bonus += 0.02  # Available nationwide
            else:
                bonus -= 0.10  # State restriction mismatch
            break
    
    # Caste match
    caste_keywords = {
        "sc ": "SC", "scheduled caste": "SC",
        "st ": "ST", "scheduled tribe": "ST", "tribal": "ST",
        "obc": "OBC", "backward class": "OBC",
        "ews": "EWS", "economically weaker": "EWS",
        "general": "General",
    }
    castes = elig.get("castes", [])
    for keyword, caste in caste_keywords.items():
        if keyword in q:
            if caste in castes:
                bonus += 0.07
            else:
                bonus -= 0.10  # Caste not eligible
            break
    
    # Category match
    if "government" in q or "govt" in q:
        if scholarship.get("category") == "Government":
            bonus += 0.05
    elif "private" in q:
        if scholarship.get("category") == "Private":
            bonus += 0.05
    elif "ngo" in q or "trust" in q:
        if scholarship.get("category") in ("NGO", "Private"):
            bonus += 0.05
    elif "international" in q or "abroad" in q or "uk" in q:
        if scholarship.get("category") == "International":
            bonus += 0.10
    
    # Name match — if the user mentions a specific scholarship name
    name = scholarship.get("name", "").lower()
    provider = scholarship.get("provider", "").lower()
    # Check for key words from the name/provider in the query
    name_words = [w for w in re.findall(r'\b\w{4,}\b', name) if w not in ("scheme", "scholarship", "students", "india")]
    for word in name_words:
        if word in q:
            bonus += 0.12  # Strong signal — user is asking about THIS scholarship
            break
    
    provider_words = [w for w in re.findall(r'\b\w{4,}\b', provider) if w not in ("government", "india", "limited")]
    for word in provider_words:
        if word in q:
            bonus += 0.10
            break
    
    return max(bonus, -0.20)  # Cap penalty at -0.20


async def embed_and_store_scholarship(session: AsyncSession, scholarship_data: dict) -> bool:
    """Generate embedding for a scholarship and store it in the database."""
    try:
        text_repr = build_scholarship_text(scholarship_data)
        embedding = await generate_embedding(text_repr)

        if not embedding:
            logger.warning(f"Failed to generate embedding for {scholarship_data['id']}")
            return False

        elig = scholarship_data.get("eligibility", {})

        db_scholarship = ScholarshipDB(
            id=scholarship_data["id"],
            name=scholarship_data["name"],
            provider=scholarship_data["provider"],
            amount=scholarship_data["amount"],
            amount_formatted=scholarship_data["amountFormatted"],
            deadline=scholarship_data["deadline"],
            eligibility_education_level=elig.get("educationLevel", []),
            eligibility_gender=elig.get("gender", "All"),
            eligibility_family_income_max=elig.get("familyIncomeMax", 0),
            eligibility_states=elig.get("states", []),
            eligibility_castes=elig.get("castes", []),
            eligibility_fields_of_study=elig.get("fieldsOfStudy", []),
            category=scholarship_data["category"],
            description=scholarship_data["description"],
            documents=scholarship_data.get("documents", []),
            official_link=scholarship_data["officialLink"],
            status=scholarship_data.get("status", "Open"),
            coverage=scholarship_data.get("coverage", ""),
            selection_process=scholarship_data.get("selectionProcess", ""),
            benefits=scholarship_data.get("benefits", ""),
            faqs=scholarship_data.get("faqs", []),
            embedding=embedding,
        )

        session.add(db_scholarship)
        return True
    except Exception as e:
        logger.error(f"Error storing scholarship {scholarship_data.get('id')}: {e}")
        return False


async def search_similar(
    session: AsyncSession,
    query: str,
    limit: int = 5,
    profile: dict | None = None,
) -> list[dict]:
    """
    Hybrid similarity search using pgvector + field matching + re-ranking.
    
    Pipeline:
    1. Preprocess query (expand abbreviations for better embeddings)
    2. Generate query embedding
    3. Fetch top candidates via pgvector cosine similarity
    4. Apply profile-based hard filters
    5. Compute field-match bonus scores
    6. Re-rank by combined score (vector similarity + field match bonus)
    7. Filter by minimum similarity threshold
    8. Return top results
    """
    # Step 1: Preprocess the query for better embedding accuracy
    enhanced_query = _preprocess_search_query(query)
    logger.info(f"Search query: '{query}' → enhanced: '{enhanced_query[:100]}'")
    
    # Step 2: Generate embedding
    query_embedding = await generate_embedding(enhanced_query)
    if not query_embedding:
        logger.warning("Failed to generate query embedding, falling back to all scholarships")
        result = await session.execute(select(ScholarshipDB).limit(limit))
        scholarships = result.scalars().all()
        return [{"scholarship": s.to_dict(), "similarity_score": 0.5} for s in scholarships]

    # Step 3: Fetch MORE candidates than needed (we'll re-rank and filter)
    fetch_count = max(limit * 3, 10)  # Fetch extra for re-ranking
    
    stmt = text("""
        SELECT *, 1 - (embedding <=> CAST(:embedding AS vector)) AS similarity
        FROM scholarships
        WHERE embedding IS NOT NULL
        ORDER BY embedding <=> CAST(:embedding AS vector), id ASC
        LIMIT :limit
    """)

    result = await session.execute(
        stmt,
        {"embedding": str(query_embedding), "limit": fetch_count},
    )
    rows = result.mappings().all()

    # Step 4 & 5: Build results with field-match scoring
    candidates = []
    for row in rows:
        scholarship_dict = {
            "id": row["id"],
            "name": row["name"],
            "provider": row["provider"],
            "amount": row["amount"],
            "amountFormatted": row["amount_formatted"],
            "deadline": row["deadline"],
            "eligibility": {
                "educationLevel": row["eligibility_education_level"] or [],
                "gender": row["eligibility_gender"],
                "familyIncomeMax": row["eligibility_family_income_max"],
                "states": row["eligibility_states"] or [],
                "castes": row["eligibility_castes"] or [],
                "fieldsOfStudy": row["eligibility_fields_of_study"] or [],
            },
            "category": row["category"],
            "description": row["description"],
            "documents": row["documents"] or [],
            "officialLink": row["official_link"],
            "status": row["status"],
            "coverage": row["coverage"],
            "selectionProcess": row["selection_process"],
            "benefits": row["benefits"],
            "faqs": row["faqs"] or [],
        }

        # Apply profile-based hard filtering (eliminates ineligible results)
        if profile:
            if not _matches_profile(scholarship_dict, profile):
                continue

        vector_score = float(row["similarity"])
        field_bonus = _compute_field_match_score(scholarship_dict, query)
        
        # Combined score: 65% vector similarity + 35% field match bonus
        # This balances semantic understanding with exact field matching
        combined_score = vector_score + field_bonus
        
        # Apply minimum threshold
        if combined_score < MIN_SIMILARITY_THRESHOLD:
            logger.debug(f"Filtered out '{row['name']}' (score={combined_score:.3f} < {MIN_SIMILARITY_THRESHOLD})")
            continue
        
        candidates.append({
            "scholarship": scholarship_dict,
            "similarity_score": round(min(combined_score, 1.0), 4),  # Cap at 1.0
            "_vector_score": round(vector_score, 4),
            "_field_bonus": round(field_bonus, 4),
        })

    # Step 6: Re-rank by combined score
    # Sort by ID first to act as a stable tie-breaker, then sort by similarity score.
    # Because Python's sort is stable, this ensures consistent ordering.
    candidates.sort(key=lambda x: x["scholarship"]["id"])
    candidates.sort(key=lambda x: x["similarity_score"], reverse=True)
    
    # Log the ranking for debugging
    for i, c in enumerate(candidates[:limit]):
        logger.info(
            f"  Rank {i+1}: {c['scholarship']['name'][:40]} "
            f"(combined={c['similarity_score']:.3f}, "
            f"vector={c['_vector_score']:.3f}, "
            f"field_bonus={c['_field_bonus']:.3f})"
        )

    # Step 7: Return top results (remove internal debug fields)
    results = []
    for c in candidates[:limit]:
        results.append({
            "scholarship": c["scholarship"],
            "similarity_score": c["similarity_score"],
        })

    return results


def _matches_profile(scholarship: dict, profile: dict) -> bool:
    """Check if a scholarship matches a student profile (hard filters)."""
    elig = scholarship.get("eligibility", {})

    # Gender check
    if profile.get("gender") and elig.get("gender") != "All":
        if elig["gender"] != profile["gender"]:
            return False

    # Education level check
    if profile.get("educationLevel"):
        ed_levels = elig.get("educationLevel", [])
        if ed_levels and "All" not in ed_levels and profile["educationLevel"] not in ed_levels:
            return False

    # Income check
    if profile.get("familyIncomeMax") is not None and elig.get("familyIncomeMax", 0) > 0:
        if profile["familyIncomeMax"] > elig["familyIncomeMax"]:
            return False

    # State check
    if profile.get("state"):
        states = elig.get("states", [])
        if states and "All" not in states and profile["state"] not in states:
            return False

    # Caste check
    if profile.get("caste"):
        castes = elig.get("castes", [])
        if castes and profile["caste"] not in castes:
            return False

    return True
