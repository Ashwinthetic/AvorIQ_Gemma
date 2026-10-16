from __future__ import annotations

from typing import Any

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from .collector import collect_for_profile
from .profile_memory import extract_profile_signals, merge_profiles
from .storage import add_chat_event, get_job, get_profile, init_db, upsert_profile


app = FastAPI(title="AvorIQ Collector API", version="0.1.0")


class ProfileUpdate(BaseModel):
    user_id: str = Field(min_length=1)
    consent: bool = False
    message: str = ""
    profile: dict[str, Any] = Field(default_factory=dict)


class ChatEvent(BaseModel):
    user_id: str = Field(min_length=1)
    role: str = Field(pattern="^(user|ai)$")
    text: str = Field(min_length=1)
    consent: bool = False


class CollectRequest(BaseModel):
    user_id: str = Field(min_length=1)
    mode: str = "scholarship_refresh"
    profile: dict[str, Any] = Field(default_factory=dict)


@app.on_event("startup")
def _startup() -> None:
    init_db()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/profiles/{user_id}")
def read_profile(user_id: str) -> dict[str, Any]:
    profile = get_profile(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="profile not found")
    return profile


@app.post("/profiles/upsert")
def upsert_profile_endpoint(payload: ProfileUpdate) -> dict[str, Any]:
    extracted = extract_profile_signals(payload.message) if payload.message else {}
    current = get_profile(payload.user_id)
    merged_profile = merge_profiles(current["profile"] if current else None, payload.profile)
    merged_profile = merge_profiles(merged_profile, extracted)
    upsert_profile(payload.user_id, merged_profile, payload.consent or (current["consent"] if current else False))
    return {"user_id": payload.user_id, "profile": merged_profile, "consent": payload.consent}


@app.post("/chat/event")
def chat_event(payload: ChatEvent) -> dict[str, Any]:
    add_chat_event(payload.user_id, payload.role, payload.text)
    existing = get_profile(payload.user_id)
    current_profile = existing["profile"] if existing else None
    if payload.role == "user":
        extracted = extract_profile_signals(payload.text)
        merged = merge_profiles(current_profile, extracted)
        upsert_profile(payload.user_id, merged, payload.consent or (existing["consent"] if existing else False))
    return {"ok": True}


@app.post("/collect")
def collect(payload: CollectRequest) -> dict[str, Any]:
    profile = payload.profile
    if not profile:
        existing = get_profile(payload.user_id)
        profile = existing["profile"] if existing else {}
    if not profile:
        raise HTTPException(status_code=400, detail="profile is required")
    return collect_for_profile(payload.user_id, profile, payload.mode)


@app.get("/jobs/{job_id}")
def job(job_id: str) -> dict[str, Any]:
    data = get_job(job_id)
    if not data:
        raise HTTPException(status_code=404, detail="job not found")
    return data

