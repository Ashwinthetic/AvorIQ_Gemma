"""
AvorIQ Backend — CSV Data Loader
Reads scholarships from a CSV file, generates embeddings, and stores them in PostgreSQL.

Usage (inside Docker):
    docker exec avoriq-backend python -m app.csv_loader --csv /app/datasets/scholarships.csv

Usage (locally with venv):
    python -m app.csv_loader --csv ../../datasets/scholarships.csv

CSV Format:
    id, name, provider, amount, amountFormatted, deadline, category, description,
    status, coverage, selectionProcess, benefits, officialLink,
    educationLevel (semicolon-separated), gender, familyIncomeMax,
    states (semicolon-separated), castes (semicolon-separated),
    fieldsOfStudy (semicolon-separated), documents (semicolon-separated)
"""

import asyncio
import csv
import logging
import argparse
import sys
from pathlib import Path

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def parse_semicolon_list(value: str) -> list[str]:
    """Parse a semicolon-separated string into a list. E.g., 'UG;PG' → ['UG', 'PG']"""
    if not value or value.strip() == "":
        return []
    return [item.strip() for item in value.split(";") if item.strip()]


def csv_row_to_scholarship(row: dict) -> dict:
    """
    Convert a CSV row (flat key-value pairs) into the nested scholarship
    dictionary format that our vector_service expects.
    """
    return {
        "id": row.get("id", "").strip(),
        "name": row.get("name", "").strip(),
        "provider": row.get("provider", "").strip(),
        "amount": int(row.get("amount", 0)),
        "amountFormatted": row.get("amountFormatted", "").strip(),
        "deadline": row.get("deadline", "").strip(),
        "category": row.get("category", "").strip(),
        "description": row.get("description", "").strip(),
        "status": row.get("status", "Open").strip(),
        "coverage": row.get("coverage", "").strip(),
        "selectionProcess": row.get("selectionProcess", "").strip(),
        "benefits": row.get("benefits", "").strip(),
        "officialLink": row.get("officialLink", "").strip(),
        "documents": parse_semicolon_list(row.get("documents", "")),
        "eligibility": {
            "educationLevel": parse_semicolon_list(row.get("educationLevel", "")),
            "gender": row.get("gender", "All").strip(),
            "familyIncomeMax": int(row.get("familyIncomeMax", 0)),
            "states": parse_semicolon_list(row.get("states", "")),
            "castes": parse_semicolon_list(row.get("castes", "")),
            "fieldsOfStudy": parse_semicolon_list(row.get("fieldsOfStudy", "")),
        },
        "faqs": [],  # CSV doesn't support FAQs easily; add manually if needed
    }


def read_csv_file(csv_path: str) -> list[dict]:
    """Read a CSV file and convert each row to a scholarship dictionary."""
    path = Path(csv_path)
    if not path.exists():
        logger.error(f"CSV file not found: {csv_path}")
        sys.exit(1)

    scholarships = []
    with open(path, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)

        # Validate required columns
        required = {"id", "name", "provider", "amount", "description"}
        if reader.fieldnames is None:
            logger.error("CSV file is empty or has no header row")
            sys.exit(1)

        missing = required - set(reader.fieldnames)
        if missing:
            logger.error(f"CSV is missing required columns: {missing}")
            logger.info(f"Found columns: {reader.fieldnames}")
            sys.exit(1)

        for i, row in enumerate(reader):
            try:
                scholarship = csv_row_to_scholarship(row)
                if not scholarship["id"] or not scholarship["name"]:
                    logger.warning(f"Row {i+2}: Skipping — missing 'id' or 'name'")
                    continue
                scholarships.append(scholarship)
            except Exception as e:
                logger.warning(f"Row {i+2}: Skipping — error: {e}")
                continue

    logger.info(f"Parsed {len(scholarships)} scholarships from CSV")
    return scholarships


async def load_csv_to_database(csv_path: str):
    """Main function: read CSV → embed → store in PostgreSQL."""

    # Import here so env vars are loaded first
    from app.database import async_session, init_db
    from app.models import ScholarshipDB
    from app.services.vector_service import embed_and_store_scholarship
    from app.services.tei_service import ensure_tei_ready
    from sqlalchemy import select

    # Step 1: Read CSV
    logger.info(f"Reading CSV from: {csv_path}")
    scholarships = read_csv_file(csv_path)

    if not scholarships:
        logger.warning("No scholarships found in CSV. Nothing to load.")
        return

    # Step 2: Init database
    logger.info("Initializing database...")
    await init_db()

    # Step 3: Ensure TEI is ready
    logger.info("Checking TEI embedding service...")
    if not await ensure_tei_ready():
        logger.error("TEI not ready — aborting CSV load.")
        return

    # Step 4: Embed and store each scholarship
    async with async_session() as session:
        success_count = 0
        skip_count = 0

        for i, scholarship in enumerate(scholarships):
            # Check if this ID already exists
            existing = await session.execute(
                select(ScholarshipDB).where(ScholarshipDB.id == scholarship["id"])
            )
            if existing.scalar_one_or_none():
                logger.info(
                    f"  [{i+1}/{len(scholarships)}] SKIP (already exists): {scholarship['name'][:50]}"
                )
                skip_count += 1
                continue

            logger.info(
                f"  [{i+1}/{len(scholarships)}] Embedding: {scholarship['name'][:50]}..."
            )
            ok = await embed_and_store_scholarship(session, scholarship)
            if ok:
                success_count += 1

        await session.commit()

    logger.info("=" * 50)
    logger.info(f"CSV Loading Complete!")
    logger.info(f"  New scholarships added: {success_count}")
    logger.info(f"  Skipped (already exist): {skip_count}")
    logger.info(f"  Failed: {len(scholarships) - success_count - skip_count}")
    logger.info("=" * 50)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Load scholarships from CSV into AvorIQ database")
    parser.add_argument(
        "--csv",
        type=str,
        required=True,
        help="Path to the CSV file (e.g., ../../datasets/scholarships.csv)",
    )
    args = parser.parse_args()

    asyncio.run(load_csv_to_database(args.csv))
