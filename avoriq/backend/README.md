# AvorIQ Collector Backend

FastAPI service that stores consented chat/profile data and triggers the
scholarship collection pipeline.

## Install

```powershell
cd E:\AvorIQ-Lab
python -m venv .venv-backend
.\.venv-backend\Scripts\Activate.ps1
pip install -r avoriq\backend\requirements.txt
```

## Run

```powershell
uvicorn avoriq.backend.app:app --reload --port 8000
```

## Endpoints

- `GET /health`
- `POST /chat/event`
- `POST /profiles/upsert`
- `POST /collect`
- `GET /profiles/{user_id}`
- `GET /jobs/{job_id}`
