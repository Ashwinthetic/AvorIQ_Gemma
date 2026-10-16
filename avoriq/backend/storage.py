from __future__ import annotations

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


DB_PATH = Path(__file__).with_name("avoriq.db")


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS profiles (
                user_id TEXT PRIMARY KEY,
                consent INTEGER NOT NULL DEFAULT 0,
                profile_json TEXT NOT NULL,
                updated_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS chat_events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                role TEXT NOT NULL,
                text TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS collected_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                source TEXT NOT NULL,
                source_url TEXT NOT NULL,
                title TEXT NOT NULL,
                trust_score REAL NOT NULL,
                trust_label TEXT NOT NULL,
                relevance_score REAL NOT NULL,
                payload_json TEXT NOT NULL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS collection_jobs (
                job_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                status TEXT NOT NULL,
                mode TEXT NOT NULL,
                result_json TEXT,
                error_text TEXT,
                created_at TEXT NOT NULL,
                finished_at TEXT
            );
            """
        )


def upsert_profile(user_id: str, profile: dict[str, Any], consent: bool) -> None:
    payload = json.dumps(profile, ensure_ascii=False)
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO profiles (user_id, consent, profile_json, updated_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                consent=excluded.consent,
                profile_json=excluded.profile_json,
                updated_at=excluded.updated_at
            """,
            (user_id, 1 if consent else 0, payload, utc_now()),
        )


def get_profile(user_id: str) -> dict[str, Any] | None:
    with connect() as conn:
        row = conn.execute(
            "SELECT user_id, consent, profile_json, updated_at FROM profiles WHERE user_id = ?",
            (user_id,),
        ).fetchone()
    if not row:
        return None
    return {
        "user_id": row["user_id"],
        "consent": bool(row["consent"]),
        "profile": json.loads(row["profile_json"]),
        "updated_at": row["updated_at"],
    }


def add_chat_event(user_id: str, role: str, text: str) -> None:
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO chat_events (user_id, role, text, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (user_id, role, text, utc_now()),
        )


def upsert_job(job_id: str, user_id: str, mode: str, status: str, result: dict[str, Any] | None = None, error_text: str | None = None) -> None:
    payload = json.dumps(result, ensure_ascii=False) if result is not None else None
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO collection_jobs (job_id, user_id, mode, status, result_json, error_text, created_at, finished_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(job_id) DO UPDATE SET
                status=excluded.status,
                result_json=excluded.result_json,
                error_text=excluded.error_text,
                finished_at=excluded.finished_at
            """,
            (job_id, user_id, mode, status, payload, error_text, utc_now(), utc_now() if status in {"completed", "failed"} else None),
        )


def get_job(job_id: str) -> dict[str, Any] | None:
    with connect() as conn:
        row = conn.execute(
            """
            SELECT job_id, user_id, mode, status, result_json, error_text, created_at, finished_at
            FROM collection_jobs
            WHERE job_id = ?
            """,
            (job_id,),
        ).fetchone()
    if not row:
        return None
    return {
        "job_id": row["job_id"],
        "user_id": row["user_id"],
        "mode": row["mode"],
        "status": row["status"],
        "result": json.loads(row["result_json"]) if row["result_json"] else None,
        "error_text": row["error_text"],
        "created_at": row["created_at"],
        "finished_at": row["finished_at"],
    }


def store_collected_item(
    user_id: str,
    source: str,
    source_url: str,
    title: str,
    trust_score: float,
    trust_label: str,
    relevance_score: float,
    payload: dict[str, Any],
) -> None:
    with connect() as conn:
        conn.execute(
            """
            INSERT INTO collected_items
            (user_id, source, source_url, title, trust_score, trust_label, relevance_score, payload_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                source,
                source_url,
                title,
                float(trust_score),
                trust_label,
                float(relevance_score),
                json.dumps(payload, ensure_ascii=False),
                utc_now(),
            ),
        )

