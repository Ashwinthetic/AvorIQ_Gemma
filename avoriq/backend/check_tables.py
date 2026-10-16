import asyncio
import os
from sqlalchemy import text
from app.database import engine

async def check():
    print(f"DATABASE_URL is: {os.getenv('DATABASE_URL')}")
    try:
        async with engine.connect() as conn:
            # Query the table names in the database
            res = await conn.execute(text(
                "SELECT table_name FROM information_schema.tables WHERE table_schema='public'"
            ))
            tables = [row[0] for row in res.fetchall()]
            print("Tables found in database:", tables)
    except Exception as e:
        print("Error connecting to database:", e)

if __name__ == "__main__":
    asyncio.run(check())
