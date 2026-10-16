"""
AvorIQ Backend — Scholarship Router
CRUD endpoints + semantic vector search + profile-based matching.
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import ScholarshipDB
from app.schemas import ScholarshipResponse, SearchRequest, SearchResult
from app.services.vector_service import search_similar

router = APIRouter(prefix="/api/scholarships", tags=["scholarships"])


@router.get("", response_model=list[ScholarshipResponse])
async def list_scholarships(
    category: str | None = Query(None, description="Filter by category"),
    education_level: str | None = Query(None, description="Filter by education level"),
    state: str | None = Query(None, description="Filter by state"),
    status: str | None = Query(None, description="Filter by status"),
    db: AsyncSession = Depends(get_db),
):
    """List all scholarships with optional filters."""
    stmt = select(ScholarshipDB)

    if category:
        stmt = stmt.where(ScholarshipDB.category == category)
    if status:
        stmt = stmt.where(ScholarshipDB.status == status)

    result = await db.execute(stmt)
    scholarships = result.scalars().all()

    # Apply JSON-column filters in Python (SQLAlchemy JSON filtering varies by dialect)
    filtered = []
    for s in scholarships:
        if education_level:
            levels = s.eligibility_education_level or []
            if education_level not in levels and "All" not in levels:
                continue
        if state:
            states = s.eligibility_states or []
            if state not in states and "All" not in states:
                continue
        filtered.append(s.to_dict())

    return filtered


@router.get("/search")
async def search_scholarships(
    query: str = Query(..., min_length=1, description="Search query"),
    limit: int = Query(5, ge=1, le=20),
    # Optional profile filters
    gender: str | None = Query(None),
    education_level: str | None = Query(None),
    family_income: int | None = Query(None),
    state: str | None = Query(None),
    caste: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    """Semantic vector search for scholarships."""
    profile = None
    if any([gender, education_level, family_income, state, caste]):
        profile = {
            "gender": gender,
            "educationLevel": education_level,
            "familyIncomeMax": family_income,
            "state": state,
            "caste": caste,
        }

    results = await search_similar(db, query, limit=limit, profile=profile)
    return results


@router.get("/{scholarship_id}", response_model=ScholarshipResponse)
async def get_scholarship(
    scholarship_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a single scholarship by ID."""
    result = await db.execute(
        select(ScholarshipDB).where(ScholarshipDB.id == scholarship_id)
    )
    scholarship = result.scalar_one_or_none()
    if not scholarship:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Scholarship not found")
    return scholarship.to_dict()


@router.post("/match")
async def match_scholarships(
    profile: dict,
    db: AsyncSession = Depends(get_db),
):
    """
    Profile-based matching — reimplements matcher.ts logic server-side.
    Returns all scholarships with match scores.
    """
    result = await db.execute(select(ScholarshipDB))
    scholarships = result.scalars().all()

    matches = []
    for s in scholarships:
        s_dict = s.to_dict()
        is_eligible, score, reasons = _compute_match(s_dict, profile)
        matches.append({
            "scholarship": s_dict,
            "isEligible": is_eligible,
            "score": score,
            "reasons": reasons,
        })

    # Sort by score descending, eligible first
    matches.sort(key=lambda m: (m["isEligible"], m["score"]), reverse=True)
    return matches


def _compute_match(scholarship: dict, profile: dict) -> tuple[bool, int, list[str]]:
    """Compute eligibility match score (mirrors frontend matcher.ts logic)."""
    reasons = []
    score = 100
    is_eligible = True
    elig = scholarship.get("eligibility", {})

    # Education Level
    ed_levels = elig.get("educationLevel", [])
    if profile.get("educationLevel"):
        if profile["educationLevel"] in ed_levels or "All" in ed_levels:
            reasons.append(f"Matches education level ({profile['educationLevel']})")
        else:
            is_eligible = False
            reasons.append(f"Education level mismatch (requires: {', '.join(ed_levels)})")

    # Gender
    if elig.get("gender") != "All" and profile.get("gender"):
        if elig["gender"] != profile["gender"]:
            is_eligible = False
            reasons.append(f"Restricted to {elig['gender']} applicants")
        else:
            reasons.append(f"Matches gender ({profile['gender']})")

    # Income
    max_income = elig.get("familyIncomeMax", 0)
    if max_income > 0 and profile.get("familyIncomeMax") is not None:
        if profile["familyIncomeMax"] > max_income:
            is_eligible = False
            reasons.append(f"Income exceeds limit (max ₹{max_income:,})")
        else:
            reasons.append(f"Income within limit (max ₹{max_income:,})")
            ratio = profile["familyIncomeMax"] / max_income if max_income > 0 else 0
            score += int((1 - ratio) * 10)

    # State
    states = elig.get("states", [])
    if states and "All" not in states and profile.get("state"):
        if profile["state"] in states:
            reasons.append(f"Matches state ({profile['state']})")
            score += 15
        else:
            is_eligible = False
            reasons.append(f"State restriction (only: {', '.join(states)})")

    # Caste
    castes = elig.get("castes", [])
    if profile.get("caste") and castes:
        if profile["caste"] in castes:
            reasons.append(f"Matches caste category ({profile['caste']})")
        else:
            is_eligible = False
            reasons.append(f"Caste mismatch (open to: {', '.join(castes)})")

    final_score = min(score, 100) if is_eligible else 0
    return is_eligible, final_score, reasons
