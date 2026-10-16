import asyncio
from httpx import AsyncClient
from app.main import app
from app.database import init_db

async def run_test():
    # Initialize the database and tables
    await init_db()
    
    async with AsyncClient(app=app, base_url="http://test") as ac:
        # 1. Test POST Profile
        payload = {
            "email": "test@student.com",
            "educationLevel": "UG",
            "gender": "Male",
            "familyIncomeMax": 250000,
            "state": "Delhi",
            "caste": "General",
            "collegeName": "DELHI UNIVERSITY",
            "enrollmentNumber": "DU-12345"
        }
        print("Sending POST /api/users/test-uid/profile...")
        res = await ac.post("/api/users/test-uid/profile", json=payload)
        print("POST Response status:", res.status_code)
        print("POST Response body:", res.json())
        
        # 2. Test GET Profile
        print("\nSending GET /api/users/test-uid/profile...")
        res = await ac.get("/api/users/test-uid/profile")
        print("GET Response status:", res.status_code)
        print("GET Response body:", res.json())

if __name__ == "__main__":
    asyncio.run(run_test())
