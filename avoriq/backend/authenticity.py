from __future__ import annotations

from dataclasses import dataclass
from urllib.parse import urlparse
from typing import Any


OFFICIAL_SUFFIXES = (".gov.in", ".nic.in", ".ac.in")


@dataclass
class AuthenticityResult:
    score: float
    label: str
    reasons: list[str]


def is_official_domain(url: str) -> bool:
    host = urlparse(url).netloc.lower()
    return host.endswith(OFFICIAL_SUFFIXES)


def score_record(record: dict[str, Any]) -> AuthenticityResult:
    score = 0.0
    reasons: list[str] = []

    source = str(record.get("source", ""))
    source_url = str(record.get("source_url", ""))
    application_link = str(record.get("application_link", ""))
    official_link = str(record.get("official_link", ""))
    title = str(record.get("scholarship_name") or record.get("title") or "")
    description = str(record.get("description", ""))
    eligibility = str(record.get("eligibility", ""))
    deadline = str(record.get("deadline", ""))

    if source == "data.gov.in":
        score += 40
        reasons.append("source=data.gov.in")
    elif source == "buddy4study.com":
        score += 25
        reasons.append("source=buddy4study")
    elif is_official_domain(source_url):
        score += 35
        reasons.append("official domain")

    if official_link and is_official_domain(official_link):
        score += 15
        reasons.append("official link is government domain")
    if application_link:
        score += 10
        reasons.append("application link present")
    if title and len(title) > 12:
        score += 5
    if description and len(description) > 40:
        score += 10
    if eligibility and len(eligibility) > 20:
        score += 5
    if deadline:
        score += 5

    if "2024" in title or "2025" in title or "2026" in title:
        score += 3
    if any(token in description.lower() for token in ["apply", "eligible", "deadline", "income"]):
        score += 2

    score = max(0.0, min(score, 100.0))
    if score >= 80:
        label = "authentic"
    elif score >= 50:
        label = "review"
    else:
        label = "low_trust"
    return AuthenticityResult(score=score, label=label, reasons=reasons)

