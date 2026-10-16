from __future__ import annotations

import re
from dataclasses import dataclass, asdict, field
from typing import Any


STATE_NAMES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
    "Ladakh", "Puducherry",
]


@dataclass
class ProfileMemory:
    display_name: str = ""
    age: str = ""
    state: str = ""
    city: str = ""
    education_level: str = ""
    stream: str = ""
    gender: str = ""
    family_income: str = ""
    interests: list[str] = field(default_factory=list)
    goals: list[str] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)


def clean_text(value: str | None) -> str:
    if not value:
        return ""
    return re.sub(r"\s+", " ", value.replace("\xa0", " ")).strip()


def _append_unique(items: list[str], value: str) -> None:
    value = clean_text(value)
    if value and value not in items:
        items.append(value)


def extract_profile_signals(text: str) -> dict[str, Any]:
    text = clean_text(text)
    lowered = text.lower()
    profile: dict[str, Any] = {"notes": []}

    patterns = {
        "display_name": [r"(?:my name is|i am|i'm)\s+([A-Za-z][A-Za-z .'-]{1,60})"],
        "age": [r"(?:i am|i'm)\s+(\d{1,2})\s*(?:years? old|yo|yrs?)"],
        "city": [r"i live in\s+([A-Za-z][A-Za-z .'-]{1,60})"],
        "state": [r"i am from\s+([A-Za-z][A-Za-z &'-]{1,60})"],
        "education_level": [r"(class\s*\d{1,2}|ug|pg|diploma|btech|be|mba|mtech|phd)"],
        "stream": [r"(science|commerce|arts|engineering|medical|management|law|stem|humanities)"],
        "gender": [r"\b(female|male|girl|boy|woman|man|transgender)\b"],
        "family_income": [r"(?:family income|income)\s*(?:is|:)?\s*(?:rs\.?|inr|₹)?\s*([0-9,]+)"],
    }

    for field, field_patterns in patterns.items():
        for pattern in field_patterns:
            match = re.search(pattern, text, flags=re.IGNORECASE)
            if match:
                profile[field] = clean_text(match.group(1))
                break

    if "scholarship" in lowered:
        _append_unique(profile["notes"], "scholarship_interest")
    if "exam" in lowered or "jee" in lowered or "neet" in lowered:
        _append_unique(profile["goals"], "exam_prep")
    if any(state.lower() in lowered for state in STATE_NAMES):
        for state in STATE_NAMES:
            if state.lower() in lowered:
                profile["state"] = state
                break

    interest_matches = re.findall(
        r"\b(ai|data science|machine learning|robotics|coding|medicine|commerce|research|business|finance|design)\b",
        lowered,
    )
    if interest_matches:
        profile["interests"] = list(dict.fromkeys([item.title() for item in interest_matches]))

    return profile


def merge_profiles(existing: dict[str, Any] | None, patch: dict[str, Any]) -> dict[str, Any]:
    merged = existing.copy() if existing else asdict(ProfileMemory())
    for key, value in patch.items():
        if not value:
            continue
        if isinstance(value, list):
            current = merged.setdefault(key, [])
            if isinstance(current, list):
                for item in value:
                    _append_unique(current, str(item))
            else:
                merged[key] = value
        else:
            merged[key] = value
    return merged


def profile_relevance_score(profile: dict[str, Any], item: dict[str, Any]) -> float:
    score = 0.0
    haystack = " ".join(str(item.get(field, "")) for field in [
        "title", "description", "eligibility", "education_level", "state", "provider"
    ]).lower()

    state = str(profile.get("state", "")).lower()
    if state and state in haystack:
        score += 30.0
    education = str(profile.get("education_level", "")).lower()
    if education and education in haystack:
        score += 20.0
    stream = str(profile.get("stream", "")).lower()
    if stream and stream in haystack:
        score += 20.0
    gender = str(profile.get("gender", "")).lower()
    if gender and gender in haystack:
        score += 10.0
    if "scholarship" in haystack:
        score += 10.0
    return min(score, 100.0)

