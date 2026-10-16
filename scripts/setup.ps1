# AvorIQ Setup Script (Windows PowerShell)
# Starts Docker services, pulls Ollama models, and verifies everything is running.

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AvorIQ Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker is running
Write-Host "[1/6] Checking Docker..." -ForegroundColor Yellow
$null = docker info 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}
Write-Host "  Docker is running." -ForegroundColor Green

# Start infrastructure services
Write-Host ""
Write-Host "[2/6] Starting PostgreSQL and Ollama..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\avoriq\backend"
docker compose up -d postgres ollama
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Failed to start services." -ForegroundColor Red
    exit 1
}
Write-Host "  Services starting..." -ForegroundColor Green

# Wait for Ollama to be healthy
Write-Host ""
Write-Host "[3/6] Waiting for Ollama to be ready..." -ForegroundColor Yellow
$maxRetries = 30
$retryCount = 0
while ($retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11435/api/tags" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "  Ollama is ready!" -ForegroundColor Green
            break
        }
    } catch {
        # Still waiting
    }
    $retryCount++
    Write-Host "  Waiting... ($retryCount/$maxRetries)" -ForegroundColor Gray
    Start-Sleep -Seconds 5
}
if ($retryCount -ge $maxRetries) {
    Write-Host "  ERROR: Ollama did not start in time." -ForegroundColor Red
    exit 1
}

# Pull models
Write-Host ""
Write-Host "[4/6] Pulling Gemma 3 4B model (~3 GB)..." -ForegroundColor Yellow
Write-Host "  This may take a few minutes on first run..." -ForegroundColor Gray
docker exec avoriq-ollama ollama pull gemma3:4b
if ($LASTEXITCODE -ne 0) {
    Write-Host "  WARNING: Failed to pull gemma3:4b. Backend will retry on startup." -ForegroundColor Yellow
}
else {
    Write-Host "  gemma3:4b pulled successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "[5/6] Pulling embedding model (nomic-embed-text, ~274 MB)..." -ForegroundColor Yellow
docker exec avoriq-ollama ollama pull nomic-embed-text
if ($LASTEXITCODE -ne 0) {
    Write-Host "  WARNING: Failed to pull nomic-embed-text. Backend will retry on startup." -ForegroundColor Yellow
}
else {
    Write-Host "  nomic-embed-text pulled successfully!" -ForegroundColor Green
}

# Start backend
Write-Host ""
Write-Host "[6/6] Starting FastAPI backend..." -ForegroundColor Yellow
docker compose up -d backend
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERROR: Failed to start backend." -ForegroundColor Red
    exit 1
}

# Wait for backend health
Write-Host "  Waiting for backend to be ready (seeding data with embeddings)..." -ForegroundColor Gray
$retryCount = 0
$maxRetries = 60  # May take longer due to embedding generation on CPU
while ($retryCount -lt $maxRetries) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        if ($response.StatusCode -eq 200) {
            Write-Host "  Backend is ready!" -ForegroundColor Green
            break
        }
    } catch {
        # Still waiting
    }
    $retryCount++
    if ($retryCount % 5 -eq 0) {
        Write-Host "  Still initializing... ($retryCount/$maxRetries) - Embedding scholarships on CPU" -ForegroundColor Gray
    }
    Start-Sleep -Seconds 5
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  AvorIQ Backend is READY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  API Server:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "  API Docs:    http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "  Health:      http://localhost:8000/api/health" -ForegroundColor Cyan
Write-Host "  Ollama:      http://localhost:11435" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Next: Run 'npm run dev' in avoriq/frontend to start the UI" -ForegroundColor Yellow
Write-Host ""
