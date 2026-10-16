"""
AvorIQ Backend — Database Configuration
Async SQLAlchemy engine with pgvector support.
"""

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import text
import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://avoriq:avoriq_secret@localhost:5432/avoriq",
)

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
)

async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    """FastAPI dependency for DB sessions."""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """Create tables and enable pgvector extension."""
    async with engine.begin() as conn:
        # Enable pgvector extension
        await conn.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
        # Import models so they register with Base.metadata
        from app.models import ScholarshipDB, UserProfileDB, ChatMessageDB  # noqa: F401
        await conn.run_sync(Base.metadata.create_all)
        
        # Failsafe migration: Add name column to user_profiles if missing
        try:
            await conn.execute(text("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS name VARCHAR"))
        except Exception:
            pass

        # Failsafe migration: Add chat_id column to chat_messages if missing
        try:
            await conn.execute(text("ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS chat_id VARCHAR DEFAULT 'default'"))
        except Exception:
            pass

        # Failsafe migrations: Add calibration columns to user_profiles if missing
        try:
            await conn.execute(text("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS target_exam VARCHAR"))
            await conn.execute(text("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS career_interest VARCHAR"))
            await conn.execute(text("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS enable_autofill BOOLEAN DEFAULT TRUE"))
            await conn.execute(text("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS calibration_answers JSON"))
            await conn.execute(text("ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS calibration_csv TEXT"))
        except Exception:
            pass
