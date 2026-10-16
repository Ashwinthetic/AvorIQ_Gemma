#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# AvorIQ — Automated Deployment Script
# ──────────────────────────────────────────────────────────────────────
# This script is designed to run on the production VPS.
# It pulls the latest commits, rebuilds outdated Docker containers,
# restarts the services, and performs disk cleanup.
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail

# Configuration
# Automatically resolve repository root directory relative to this script's location
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
INSTALL_DIR="$( dirname "$SCRIPT_DIR" )"
BRANCH="main"

echo "========================================="
echo "  🚀 AvorIQ Deployment Started"
echo "  Time: $(date)"
echo "  Repo Root: $INSTALL_DIR"
echo "========================================="

# 1. Ensure directory exists
if [ -d "$INSTALL_DIR" ]; then
  cd "$INSTALL_DIR"
else
  echo "❌ ERROR: Installation directory $INSTALL_DIR not found!"
  exit 1
fi

# 3. Navigate to Docker directory and stop running services
echo "🛑 Stopping running Docker services..."
cd avoriq/backend
docker compose down

# 4. Build Docker containers
echo "🏗️ Building Docker services..."
docker compose build

# 5. Start Docker services
echo "🚀 Starting Docker services..."
docker compose up -d

# 4. Verification
echo "🛡️ Verifying container health..."
docker compose ps

# 5. Clean up old build layers and dangling images (Crucial for VPS storage!)
echo "🧹 Cleaning up unused Docker artifacts..."
docker image prune -f

echo "========================================="
echo "  ✅ AvorIQ Deployment Completed!"
echo "  Time: $(date)"
echo "========================================="
