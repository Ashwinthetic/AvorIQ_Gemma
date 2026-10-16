#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────
# AvorIQ — Ubuntu VPS Setup Script
# Provisions a fresh Ubuntu 22.04/24.04 VPS for production deployment.
#
# What this script does:
#   1. Installs Docker Engine + Compose plugin
#   2. Clones the AvorIQ repo
#   3. Starts Postgres, Ollama, Backend, and Frontend containers
#   4. Pulls the gemma3:4b model (~3 GB)
#   5. Installs and configures Caddy as a TLS reverse proxy
#
# Usage:
#   chmod +x scripts/setup_ubuntu.sh
#   sudo ./scripts/setup_ubuntu.sh --domain avoriq.example.com
#
# Prerequisites:
#   - Fresh Ubuntu 22.04 or 24.04 VPS with root/sudo access
#   - A domain name pointed at this server's IP (A record)
#   - A Hugging Face API token (Read scope) — paste into .env later
# ──────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Parse args ──
DOMAIN=""
INSTALL_DIR="/opt/avoriq"
REPO_URL="https://github.com/adityatomar4877-rgb/AvorIQ.git"

while [[ $# -gt 0 ]]; do
  case $1 in
    --domain) DOMAIN="$2"; shift 2 ;;
    --dir)    INSTALL_DIR="$2"; shift 2 ;;
    --repo)   REPO_URL="$2"; shift 2 ;;
    *) echo "Unknown option: $1"; exit 1 ;;
  esac
done

if [[ -z "$DOMAIN" ]]; then
  echo "Usage: $0 --domain your-domain.com [--dir /opt/avoriq] [--repo https://...]"
  echo "  --domain  REQUIRED. Your domain name (must have A record pointing here)."
  exit 1
fi

echo ""
echo "========================================"
echo "  AvorIQ Ubuntu VPS Setup"
echo "  Domain: $DOMAIN"
echo "  Install: $INSTALL_DIR"
echo "========================================"
echo ""

# ── Step 1: System update + essentials ──
echo "[1/8] Updating system packages..."
apt-get update && apt-get upgrade -y
apt-get install -y curl git ufw fail2ban unattended-upgrades

# ── Step 2: Firewall ──
echo ""
echo "[2/8] Configuring firewall (UFW)..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
echo "  ✓ Firewall active (22, 80, 443 open)"

# ── Step 3: Docker ──
echo ""
echo "[3/8] Installing Docker Engine + Compose..."
if command -v docker &>/dev/null; then
  echo "  Docker already installed: $(docker --version)"
else
  curl -fsSL https://get.docker.com | sh
  echo "  ✓ Docker installed: $(docker --version)"
fi

# Ensure current user can use docker
if ! groups | grep -q docker; then
  usermod -aG docker "$(whoami)" 2>/dev/null || true
fi

# ── Step 4: Clone repo ──
echo ""
echo "[4/8] Setting up project directory..."
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

if [[ -d ".git" ]]; then
  echo "  Repository already cloned, pulling latest..."
  git pull
else
  echo "  Cloning from $REPO_URL..."
  git clone "$REPO_URL" .
fi

# ── Step 5: Configure environment ──
echo ""
echo "[5/8] Configuring environment files..."

# Backend .env — generate a strong DB password
DB_PASSWORD=$(openssl rand -hex 24)

# Only create .env if it doesn't exist (don't overwrite user's config)
if [[ ! -f "avoriq/backend/.env" ]]; then
  cat > avoriq/backend/.env << ENVEOF
# ── Database ──
DATABASE_URL=postgresql+asyncpg://avoriq:${DB_PASSWORD}@postgres:5432/avoriq
POSTGRES_PASSWORD=${DB_PASSWORD}

# ── Ollama (chat LLM) ──
OLLAMA_BASE_URL=http://ollama:11434
CHAT_MODEL=gemma3:4b
OLLAMA_PUBLIC_URL=http://localhost:11435
CHAT_CONTEXT_LENGTH=4096
CHAT_MAX_TOKENS=512
OLLAMA_KEEP_ALIVE=10m
OLLAMA_NUM_PARALLEL=1
OLLAMA_MAX_LOADED_MODELS=1

# ── Embeddings (HF Inference API) ──
EMBEDDING_MODEL=BAAI/bge-m3
EMBEDDING_DIM=1024

# ── Hugging Face Inference API ──
# ⚠️  PASTE YOUR HF TOKEN BELOW. Get one at https://huggingface.co/settings/tokens
HF_API_TOKEN=PASTE_YOUR_HF_TOKEN_HERE
HF_API_BASE_URL=https://api-inference.huggingface.co
EMBEDDING_PRIMARY=hf_api

# ── CORS ──
CORS_ORIGINS=https://${DOMAIN},http://localhost:3000
ENVEOF
  chmod 600 avoriq/backend/.env
  echo "  ✓ Backend .env created (DB password auto-generated)"
  echo "  ⚠  You MUST edit avoriq/backend/.env and paste your HF_API_TOKEN!"
else
  echo "  Backend .env already exists, skipping"
fi

# Update docker-compose postgres password to match
if [[ -f "avoriq/backend/docker-compose.yml" ]]; then
  sed -i "s/POSTGRES_PASSWORD: avoriq_secret/POSTGRES_PASSWORD: ${DB_PASSWORD}/" avoriq/backend/docker-compose.yml
fi

# Frontend .env.production
if [[ ! -f "avoriq/frontend/.env.production" ]]; then
  cat > avoriq/frontend/.env.production << ENVEOF
NEXT_PUBLIC_API_URL=https://${DOMAIN}
ENVEOF
  echo "  ✓ Frontend .env.production created"
else
  echo "  Frontend .env.production already exists, skipping"
fi

# ── Step 6: Build and start containers ──
echo ""
echo "[6/8] Building and starting Docker containers..."
cd avoriq/backend

# Build frontend image first
echo "  Building frontend image (this takes 2-3 minutes)..."
docker compose build frontend

# Start all services
echo "  Starting all services..."
docker compose up -d

echo "  ✓ All containers starting"

# ── Step 7: Pull Gemma 3 4B model ──
echo ""
echo "[7/8] Pulling Gemma 3 4B model (~3 GB)..."
echo "  Waiting for Ollama to be ready..."

MAX_RETRIES=30
RETRY_COUNT=0
while [[ $RETRY_COUNT -lt $MAX_RETRIES ]]; do
  if docker exec avoriq-ollama ollama list &>/dev/null; then
    echo "  Ollama is ready!"
    break
  fi
  RETRY_COUNT=$((RETRY_COUNT + 1))
  echo "  Waiting... ($RETRY_COUNT/$MAX_RETRIES)"
  sleep 5
done

if [[ $RETRY_COUNT -ge $MAX_RETRIES ]]; then
  echo "  ⚠ Ollama didn't start in time. Run manually:"
  echo "    docker exec avoriq-ollama ollama pull gemma3:4b"
else
  docker exec avoriq-ollama ollama pull gemma3:4b
  echo "  ✓ gemma3:4b pulled successfully"
fi

# ── Step 8: Install and configure Caddy ──
echo ""
echo "[8/8] Installing and configuring Caddy reverse proxy..."
cd "$INSTALL_DIR"

if ! command -v caddy &>/dev/null; then
  apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
  apt-get update
  apt-get install -y caddy
  echo "  ✓ Caddy installed"
else
  echo "  Caddy already installed"
fi

# Write Caddyfile
mkdir -p /var/log/caddy
chown caddy:caddy /var/log/caddy 2>/dev/null || true

cat > /etc/caddy/Caddyfile << CADDYEOF
# AvorIQ — Caddy Reverse Proxy
${DOMAIN} {
    encode zstd gzip

    # Backend API
    handle /api/* {
        reverse_proxy 127.0.0.1:8000 {
            header_up Host {host}
            header_up X-Real-IP {remote_host}
            header_up X-Forwarded-For {remote_host}
            header_up X-Forwarded-Proto {scheme}
        }
    }

    # Frontend (everything else)
    handle {
        reverse_proxy 127.0.0.1:3000
    }

    # Security headers
    header {
        Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "DENY"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "geolocation=(), microphone=(), camera=()"
    }

    log {
        output file /var/log/caddy/avoriq.log {
            roll_size 50mb
            roll_keep 5
        }
    }
}
CADDYEOF

systemctl enable caddy
systemctl restart caddy
echo "  ✓ Caddy configured and running"

# ── Done ──
echo ""
echo "========================================"
echo "  AvorIQ Setup Complete!"
echo "========================================"
echo ""
echo "  Your site will be live at: https://${DOMAIN}"
echo "  (Caddy will auto-issue a Let's Encrypt TLS certificate)"
echo ""
echo "  ⚠  IMPORTANT: Before it works, you MUST:"
echo "     1. Edit the HF token:  nano ${INSTALL_DIR}/avoriq/backend/.env"
echo "     2. Restart the backend: cd ${INSTALL_DIR}/avoriq/backend && docker compose restart backend"
echo ""
echo "  Useful commands:"
echo "     View logs:      cd ${INSTALL_DIR}/avoriq/backend && docker compose logs -f"
echo "     Restart all:    cd ${INSTALL_DIR}/avoriq/backend && docker compose restart"
echo "     Health check:   curl -s https://${DOMAIN}/api/health | python3 -m json.tool"
echo "     Caddy logs:     tail -f /var/log/caddy/avoriq.log"
echo ""
