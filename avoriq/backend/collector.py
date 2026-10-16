from __future__ import annotations

import csv
import json
import subprocess
import sys
import tempfile
import uuid
from pathlib import Path
from typing import Any

from .authenticity import score_record
from .profile_memory import profile_relevance_score
from .source_registry import build_source_plan
from .storage import store_collected_item, upsert_job


ROOT = Path(__file__).resolve().parents[2]
SCRAPER = ROOT / "avoriq" / "scripts" / "scrape_scholarships.py"


def run_scholarship_scraper(output_dir: Path) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    python_executable = sys.executable
    subprocess.run(
        [
            python_executable,
            str(SCRAPER),
            "--output-dir",
            str(output_dir),
            "--max-buddy-pages",
            "1",
            "--max-buddy-details",
            "20",
            "--delay",
            "0.5",
            "--timeout",
            "30",
        ],
        check=True,
        cwd=str(ROOT),
    )
    return output_dir / "scholarships.csv"


def load_csv_rows(csv_path: Path) -> list[dict[str, Any]]:
    with csv_path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        return [dict(row) for row in reader]


def collect_for_profile(user_id: str, profile: dict[str, Any], mode: str = "scholarship_refresh") -> dict[str, Any]:
    job_id = str(uuid.uuid4())
    upsert_job(job_id, user_id, mode, "running")

    try:
        source_plan = build_source_plan(profile)
        with tempfile.TemporaryDirectory(prefix=f"avoriq_{user_id}_") as tmpdir:
            csv_path = run_scholarship_scraper(Path(tmpdir))
            rows = load_csv_rows(csv_path)

        collected = []
        for row in rows:
            trust = score_record(row)
            relevance = profile_relevance_score(profile, row)
            item = {
                "job_id": job_id,
                "user_id": user_id,
                "profile": profile,
                "source_plan": source_plan,
                "record": row,
                "trust_score": trust.score,
                "trust_label": trust.label,
                "trust_reasons": trust.reasons,
                "relevance_score": relevance,
            }
            store_collected_item(
                user_id=user_id,
                source=row.get("source", ""),
                source_url=row.get("official_link") or row.get("source_url", ""),
                title=row.get("scholarship_name") or row.get("title") or "",
                trust_score=trust.score,
                trust_label=trust.label,
                relevance_score=relevance,
                payload=item,
            )
            collected.append(item)

        result = {
            "job_id": job_id,
            "status": "completed",
            "collected_count": len(collected),
            "source_count": len(source_plan),
        }
        upsert_job(job_id, user_id, mode, "completed", result=result)
        return result
    except Exception as exc:
        upsert_job(job_id, user_id, mode, "failed", error_text=str(exc))
        raise

