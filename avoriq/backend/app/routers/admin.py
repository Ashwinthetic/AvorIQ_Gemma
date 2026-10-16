"""
AvorIQ Backend — Admin Router
Endpoints for uploading csv files and database management.
"""

from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, Header, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import csv
import io
import logging
import os
import base64
from app.database import get_db
from app.models import ScholarshipDB
from app.services.vector_service import embed_and_store_scholarship
from app.csv_loader import csv_row_to_scholarship

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/admin", tags=["admin"])


def verify_admin_credentials(
    x_admin_id: str | None = Header(None, alias="X-Admin-Id"),
    x_admin_password: str | None = Header(None, alias="X-Admin-Password"),
    authorization: str | None = Header(None)
):
    expected_id = os.getenv("ADMIN_ID")
    expected_password = os.getenv("ADMIN_PASSWORD")
    
    provided_id = x_admin_id
    provided_password = x_admin_password
    
    # If not provided in custom headers, try standard HTTP Basic auth
    if (not provided_id or not provided_password) and authorization:
        if authorization.lower().startswith("basic "):
            try:
                encoded_creds = authorization[6:].strip()
                decoded = base64.b64decode(encoded_creds).decode("utf-8")
                if ":" in decoded:
                    provided_id, provided_password = decoded.split(":", 1)
            except Exception:
                pass
                
    if not provided_id or not provided_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing administrative credentials"
        )
        
    if provided_id != expected_id or provided_password != expected_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrative ID or password"
        )


@router.post("/upload-csv")
async def upload_csv(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    _ = Depends(verify_admin_credentials)
):
    """
    Upload a CSV file of scholarships, generate embeddings for each, 
    and store them in the pgvector database.
    """
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    try:
        contents = await file.read()
        # Decode the file bytes to string (handling BOM automatically via utf-8-sig)
        csv_text = contents.decode("utf-8-sig")
        reader = csv.DictReader(io.StringIO(csv_text))
    except Exception as e:
        logger.error(f"Failed to read/decode CSV file: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to read CSV file: {str(e)}")

    # Validate required columns
    required = {"id", "name", "provider", "amount", "description"}
    if reader.fieldnames is None:
        raise HTTPException(status_code=400, detail="CSV file is empty or has no headers")

    missing = required - set(reader.fieldnames)
    if missing:
        raise HTTPException(
            status_code=400, 
            detail=f"CSV is missing required columns: {missing}. Found: {reader.fieldnames}"
        )

    success_count = 0
    skip_count = 0
    fail_count = 0
    errors = []

    for i, row in enumerate(reader):
        row_num = i + 2  # 1-based, plus 1 for header
        try:
            scholarship = csv_row_to_scholarship(row)
            if not scholarship["id"] or not scholarship["name"]:
                errors.append(f"Row {row_num}: Missing 'id' or 'name'")
                fail_count += 1
                continue

            # Check if this ID already exists
            existing = await db.execute(
                select(ScholarshipDB).where(ScholarshipDB.id == scholarship["id"])
            )
            if existing.scalar_one_or_none():
                skip_count += 1
                continue

            # Embed and store
            ok = await embed_and_store_scholarship(db, scholarship)
            if ok:
                success_count += 1
            else:
                fail_count += 1
                errors.append(f"Row {row_num}: Embedding generation failed")
        except Exception as e:
            fail_count += 1
            errors.append(f"Row {row_num}: {str(e)}")

    try:
        await db.commit()
    except Exception as e:
        await db.rollback()
        logger.error(f"Database transaction failed on CSV upload commit: {e}")
        raise HTTPException(status_code=500, detail=f"Database transaction failed: {str(e)}")

    return {
        "message": "CSV processing complete",
        "added": success_count,
        "skipped": skip_count,
        "failed": fail_count,
        "errors": errors[:50]  # Return first 50 errors for user troubleshooting
    }
