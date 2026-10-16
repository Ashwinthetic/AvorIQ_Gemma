from __future__ import annotations

from dataclasses import dataclass, asdict


@dataclass(frozen=True)
class SourceSpec:
    name: str
    source_type: str
    url: str
    trust: int
    notes: str


DEFAULT_SOURCES = [
    SourceSpec(
        name="data_gov_scholarships_2024_25",
        source_type="government_open_data",
        url="https://www.data.gov.in/resource/scholarship-data-2024-25",
        trust=95,
        notes="Official government open-data resource",
    ),
    SourceSpec(
        name="data_gov_scholarships_history",
        source_type="government_open_data",
        url="https://www.data.gov.in/resource/scholarships-students-community-districts-2016-17-shb-2018",
        trust=95,
        notes="Official government open-data resource",
    ),
    SourceSpec(
        name="buddy4study_scholarships",
        source_type="scholarship_portal",
        url="https://www.buddy4study.com/scholarships",
        trust=70,
        notes="Commercial portal with structured scholarship listings",
    ),
]


def default_source_catalog() -> list[dict[str, str | int]]:
    return [asdict(item) for item in DEFAULT_SOURCES]


def build_source_plan(profile: dict[str, object]) -> list[dict[str, str | int]]:
    plan = default_source_catalog()
    text = " ".join(str(v) for v in profile.values()).lower()
    if any(token in text for token in ["female", "girl", "women", "woman"]):
        plan.append(
            {
                "name": "women_scholarships_focus",
                "source_type": "search_hint",
                "url": "https://www.buddy4study.com/scholarships",
                "trust": 65,
                "notes": "Profile hints suggest women-focused scholarship collection",
            }
        )
    if any(token in text for token in ["engineering", "btech", "be", "mtech"]):
        plan.append(
            {
                "name": "engineering_scholarships_focus",
                "source_type": "search_hint",
                "url": "https://www.buddy4study.com/scholarships",
                "trust": 65,
                "notes": "Profile hints suggest engineering-focused collection",
            }
        )
    return plan

