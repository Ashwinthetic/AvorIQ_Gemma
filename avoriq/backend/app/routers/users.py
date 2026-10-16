"""
AvorIQ Backend — Users Router
Endpoints for managing user profiles and chat histories in PostgreSQL.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from app.database import get_db
from app.models import UserProfileDB, ChatMessageDB
from pydantic import BaseModel
import time

router = APIRouter(prefix="/api/users", tags=["users"])


class ProfileUpdate(BaseModel):
    name: str | None = None
    email: str
    educationLevel: str | None = None
    gender: str | None = None
    familyIncomeMax: int | None = 0
    state: str | None = None
    caste: str | None = None
    collegeName: str | None = None
    enrollmentNumber: str | None = None
    targetExam: str | None = None
    careerInterest: str | None = None
    enableAutofill: bool | None = True
    calibrationAnswers: dict | None = None
    calibrationCsv: str | None = None


class ChatMessageModel(BaseModel):
    id: str
    sender: str
    text: str
    results: list | None = None


class ChatHistorySync(BaseModel):
    messages: list[ChatMessageModel]


@router.get("/{uid}/profile")
async def get_profile(uid: str, db: AsyncSession = Depends(get_db)):
    """Fetch the user's questionnaire profile answers."""
    result = await db.execute(select(UserProfileDB).where(UserProfileDB.uid == uid))
    profile = result.scalar_one_or_none()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile.to_dict()


@router.post("/{uid}/profile")
async def save_profile(uid: str, profile_data: ProfileUpdate, db: AsyncSession = Depends(get_db)):
    """Save or update the user's questionnaire profile answers."""
    result = await db.execute(select(UserProfileDB).where(UserProfileDB.uid == uid))
    profile = result.scalar_one_or_none()
    
    if profile:
        profile.name = profile_data.name
        profile.email = profile_data.email
        profile.education_level = profile_data.educationLevel
        profile.gender = profile_data.gender
        profile.family_income_max = profile_data.familyIncomeMax
        profile.state = profile_data.state
        profile.caste = profile_data.caste
        profile.college_name = profile_data.collegeName
        profile.enrollment_number = profile_data.enrollmentNumber
        profile.target_exam = profile_data.targetExam
        profile.career_interest = profile_data.careerInterest
        profile.enable_autofill = profile_data.enableAutofill
        profile.calibration_answers = profile_data.calibrationAnswers
        profile.calibration_csv = profile_data.calibrationCsv
    else:
        profile = UserProfileDB(
            uid=uid,
            name=profile_data.name,
            email=profile_data.email,
            education_level=profile_data.educationLevel,
            gender=profile_data.gender,
            family_income_max=profile_data.familyIncomeMax,
            state=profile_data.state,
            caste=profile_data.caste,
            college_name=profile_data.collegeName,
            enrollment_number=profile_data.enrollmentNumber,
            target_exam=profile_data.targetExam,
            career_interest=profile_data.careerInterest,
            enable_autofill=profile_data.enableAutofill,
            calibration_answers=profile_data.calibrationAnswers,
            calibration_csv=profile_data.calibrationCsv
        )
        db.add(profile)
        
    await db.commit()
    return {"status": "success", "profile": profile.to_dict()}


@router.get("/{uid}/chat")
async def get_chat_history(uid: str, db: AsyncSession = Depends(get_db)):
    """Fetch the full chat history for a specific authenticated user."""
    result = await db.execute(
        select(ChatMessageDB)
        .where(ChatMessageDB.uid == uid)
        .order_by(ChatMessageDB.created_at.asc())
    )
    messages = result.scalars().all()
    return [m.to_dict() for m in messages]


@router.post("/{uid}/chat")
async def sync_chat_history(
    uid: str, 
    sync_data: ChatHistorySync, 
    chatId: str = "default", 
    db: AsyncSession = Depends(get_db)
):
    """Overwrite/synchronise the user's chat history for a specific chat ID in the PostgreSQL database."""
    # Delete existing chat messages for this user and chatId to perform a clean sync
    await db.execute(
        delete(ChatMessageDB)
        .where(ChatMessageDB.uid == uid, ChatMessageDB.chat_id == chatId)
    )
    
    # Insert new messages
    for i, msg in enumerate(sync_data.messages):
        # We use a timestamp offset by position to preserve exact ordering
        created_at = time.time() + (i * 0.001)
        db_msg = ChatMessageDB(
            id=msg.id,
            uid=uid,
            chat_id=chatId,
            sender=msg.sender,
            text=msg.text,
            created_at=created_at,
            results=msg.results
        )
        db.add(db_msg)
        
    await db.commit()
    return {"status": "success", "count": len(sync_data.messages)}


@router.delete("/{uid}/chat")
async def clear_chat_history(
    uid: str, 
    chatId: str | None = None, 
    db: AsyncSession = Depends(get_db)
):
    """Delete chat logs for a specific chat ID or all chat logs if chatId is not provided."""
    if chatId:
        await db.execute(
            delete(ChatMessageDB)
            .where(ChatMessageDB.uid == uid, ChatMessageDB.chat_id == chatId)
        )
    else:
        await db.execute(delete(ChatMessageDB).where(ChatMessageDB.uid == uid))
    await db.commit()
    return {"status": "success", "message": "Chat history cleared"}
