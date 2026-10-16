# AvorIQ — Ubuntu VPS Deployment Guide

> Last updated: 2026-06-19
> Target: Ubuntu 22.04 LTS or 24.04 LTS on a fresh VPS (Hetzner, DigitalOcean, Linode, AWS Lightsail, etc.)
> Stack: Postgres + pgvector · Ollama (gemma3:4b) · FastAPI · Next.js · Caddy reverse proxy · Hugging Face Inference API for embeddings

---

## 0. Architecture at a glance

```
                ┌─────────────────────────────────────────────┐
                │             Ubuntu VPS (host)               │
                │                                             │
   Internet ───▶│  :80, :443                                  │
                │   └─▶ Caddy (TLS + reverse proxy)           │
                │         ├─▶ :3000  Next.js (frontend)       │
                │         └─▶ :8000  FastAPI (backend)        │
                │                                             │
                │  Internal (docker network `avoriq-net`)     │
                │   ├─▶ avoriq-postgres    :5432              │
                │   ├─▶ avoriq-ollama      :11434 → :11435    │
                │   ├─▶ avoriq-backend     :8000              │
                │   └─▶ avoriq-frontend    :3000              │
                │                                             │
                └─────────────────────────────────────────────┘
                                    │
                                    ▼  HTTPS  (only this egress)
                        api-inference.huggingface.co
                        (bge-m3 embeddings, 1024-dim)
```

Only port 80/443 is exposed publicly. Postgres and Ollama bind to `127.0.0.1` on the host so they're never directly reachable from the internet. The HF Inference API is the **only outbound service** the backend calls.

---

## 1. Pick a VPS

### Recommended specs for gemma3:4b

| Tier       | vCPU | RAM   | Disk  | Provider (cheapest at time of writing) | Monthly USD |
|------------|------|-------|-------|---------------------------------------|-------------|
| Minimum    | 4    | 8 GB  | 60 GB | Hetzner CX32, DO 8GB                  | ~$18       |
| Recommended| 4    | 16 GB | 80 GB | Hetzner CX42, DO 16GB                 | ~$40       |
| Heavy prod | 8    | 32 GB | 160GB | Hetzner CCX33, DO 32GB                | ~$80       |

**Why this much RAM?** Ollama needs ~5 GB for `gemma3:4b` (model weights ~3 GB Q4_0 + KV cache ~1.5 GB at 4k context + runtime overhead). Postgres needs ~1 GB. The Next.js production build uses ~200 MB. OS + Caddy ≈ 500 MB. **8 GB is the absolute floor; 16 GB is strongly recommended.**

**Region**: pick one close to your users (e.g. `ap-south-mumbai` for India, since AvorIQ targets Indian students).

### OS

- **Ubuntu 22.04 LTS** (most stable) or **Ubuntu 24.04 LTS** (newer packages).
- **DO NOT** use a 32-bit image — `pgvector` and embeddings need 64-bit.

---

## 2. Quick deploy (automated script)

If you want to skip the manual steps, use the automated setup script:

```bash
# SSH into your VPS as root or sudo user
ssh deploy@your-server-ip

# Clone the repo
git clone https://github.com/adityatomar4877-rgb/AvorIQ.git /opt/avoriq
cd /opt/avoriq

# Run the automated setup
chmod +x scripts/setup_ubuntu.sh
sudo ./scripts/setup_ubuntu.sh --domain avoriq.yourdomain.com

# Then paste your HF token
nano /opt/avoriq/avoriq/backend/.env
# (paste your HF_API_TOKEN, save, exit)

# Restart backend to pick up the token
cd /opt/avoriq/avoriq/backend
docker compose restart backend
```

The script handles everything: Docker, firewall, containers, model pull, and Caddy TLS.

**If you prefer to do it manually, continue reading below.**

---

## 3. First login and hardening

SSH in as `root` (most providers give this) or your sudo user.

```bash
# Update everything
apt update && apt upgrade -y

# Create a non-root user (skip if you already have one)
adduser deploy
usermod -aG sudo deploy
# Copy your SSH key for the new user
rsync --archive --chown=deploy:deploy ~/.ssh /home/deploy/

# Test login as `deploy` from a new terminal BEFORE closing root
```

From this point on, log in as `deploy`. **Disable root SSH**:

```bash
sudo sed -i 's/^PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/^#\?PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

### Set up the firewall

```bash
sudo apt install -y ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp     # SSH
sudo ufw allow 80/tcp     # HTTP (Caddy will redirect to HTTPS)
sudo ufw allow 443/tcp    # HTTPS
sudo ufw enable
sudo ufw status verbose
```

### Optional but recommended: fail2ban + automatic security updates

```bash
sudo apt install -y fail2ban unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades   # answer "Yes"
```

---

## 4. Install Docker

```bash
# Install Docker Engine + Compose plugin
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker deploy
newgrp docker     # apply the group without logging out

# Verify
docker --version
docker compose version
docker ps   # should not error
```

`docker compose` (v2, plugin-based) is what this project uses — make sure you have it, not the legacy `docker-compose` Python tool.

---

## 5. Configure DNS

In your domain registrar's DNS settings, point an **A record** at the VPS IPv4 address (and an **AAAA** record at the IPv6 if your VPS has one):

```
avoriq.example.com.   A     203.0.113.42
avoriq.example.com.   AAAA  2001:db8::42
```

Wait 5–60 minutes for propagation. Caddy will use this domain to issue a Let's Encrypt cert automatically.

---

## 6. Clone the repo and set up environment

```bash
# Pick where the app lives
sudo mkdir -p /opt/avoriq
sudo chown deploy:deploy /opt/avoriq
cd /opt/avoriq

# Clone (use your fork or branch)
git clone https://github.com/adityatomar4877-rgb/AvorIQ.git .
# or: git clone <your-fork-url> .

# Create the .env file from scratch — never commit secrets
cd avoriq/backend
nano .env             # see template below
```

### `.env` template

```env
# ── Database ──
DATABASE_URL=postgresql+asyncpg://avoriq:CHANGE_ME@postgres:5432/avoriq
POSTGRES_PASSWORD=CHANGE_ME   # mirror of the password in DATABASE_URL

# ── Ollama (chat) ──
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

# Hugging Face — get a Read-scoped token at
# https://huggingface.co/settings/tokens
# PASTE A NEW TOKEN HERE. NEVER COMMIT THIS FILE.
HF_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
HF_API_BASE_URL=https://api-inference.huggingface.co
EMBEDDING_PRIMARY=hf_api

# ── Public URLs (what the frontend sees) ──
NEXT_PUBLIC_API_URL=https://avoriq.example.com
PUBLIC_BASE_URL=https://avoriq.example.com

# ── CORS ──
CORS_ORIGINS=https://avoriq.example.com,http://localhost:3000

# ── Optional: Firebase (only if you wire it up) ──
# NEXT_PUBLIC_FIREBASE_API_KEY=...
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
# NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
# NEXT_PUBLIC_FIREBASE_APP_ID=...
```

> ⚠️ **Replace every `CHANGE_ME`** with a random 32+ char string. Use `openssl rand -hex 24`.
> ⚠️ **Paste a NEW HF token** directly. Never paste into chat or git.

Generate a strong DB password:

```bash
openssl rand -hex 24
# e.g. 9f3a8b1c2d4e5f6789... paste into both POSTGRES_PASSWORD and DATABASE_URL
```

Set restrictive file permissions on `.env`:

```bash
chmod 600 .env
```

Also update the docker-compose Postgres password to match:

```bash
# In docker-compose.yml, change POSTGRES_PASSWORD to match your .env
sed -i "s/POSTGRES_PASSWORD: avoriq_secret/POSTGRES_PASSWORD: YOUR_PASSWORD_HERE/" docker-compose.yml
```

---

## 7. Configure the frontend for production

Create `avoriq/frontend/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://avoriq.example.com
# Firebase values from your Firebase console, if used
# NEXT_PUBLIC_FIREBASE_API_KEY=...
```

The frontend Dockerfile is already included in the repo at `avoriq/frontend/Dockerfile`. It uses a multi-stage build (deps → build → runner) producing a ~130 MB image.

The `next.config.ts` already has `output: 'standalone'` configured for production builds.

---

## 8. Install Caddy (TLS reverse proxy)

```bash
# Install
sudo apt install -y caddy

# Write the Caddyfile
sudo nano /etc/caddy/Caddyfile
```

`/etc/caddy/Caddyfile`:

```caddyfile
# Replace with your real domain
avoriq.example.com {
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
```

Caddy will auto-issue a Let's Encrypt cert on first start.

```bash
# Make sure the log dir exists and is writable
sudo mkdir -p /var/log/caddy
sudo chown caddy:caddy /var/log/caddy

# Validate the Caddyfile
sudo caddy validate --config /etc/caddy/Caddyfile

# Enable + start
sudo systemctl enable caddy
sudo systemctl restart caddy
sudo systemctl status caddy
```

---

## 9. Bring up the application

```bash
cd /opt/avoriq/avoriq/backend

# Build the frontend image (pulls deps, ~2-3 min)
docker compose build frontend

# Bring everything up (postgres + ollama + backend + frontend)
docker compose up -d

# Pull the gemma3:4b model (~3 GB, first-time only)
docker exec avoriq-ollama ollama pull gemma3:4b

# Watch the logs
docker compose logs -f backend
```

You should see (after ~2-3 minutes):

```
[1/4] Initializing database and pgvector extension...
  ✓ Database initialized
[2/4] Checking embedding provider (primary=hf_api)...
  ✓ Embedding provider ready
[3/4] Checking Ollama chat model...
  ✓ Ollama ready
[4/4] Seeding scholarship data...
  ✓ Data seeded
  AvorIQ Backend Ready! → http://localhost:8000
```

Caddy should now be serving <https://avoriq.example.com>.

---

## 10. Smoke tests from the VPS

```bash
# Health
curl -s https://avoriq.example.com/api/health | jq

# Search
curl -s "https://avoriq.example.com/api/scholarships/search?query=SC%20girl%20engineering&limit=3" | jq

# Verify embedding dim
docker exec avoriq-postgres psql -U avoriq -d avoriq -c "SELECT vector_dims(embedding), count(*) FROM scholarships GROUP BY 1;"
# Expected: 1024 | 20

# Frontend HTML
curl -sI https://avoriq.example.com/ | head -5
# Expected: HTTP/2 200
```

---

## 11. Ongoing operations

### View logs

```bash
# All services
cd /opt/avoriq/avoriq/backend && docker compose logs -f --tail 100

# One service
docker compose logs -f backend

# Caddy access logs (TLS + reverse proxy)
sudo tail -f /var/log/caddy/avoriq.log
```

### Restart everything

```bash
cd /opt/avoriq/avoriq/backend
docker compose restart
```

### Update the application

```bash
cd /opt/avoriq
git pull
cd avoriq/backend
docker compose build frontend    # only if frontend changed
docker compose up -d
```

### Backup the database

```bash
# Full logical dump (recommended before any risky change)
docker exec avoriq-postgres pg_dump -U avoriq -d avoriq -Fc -f /tmp/avoriq.dump
docker cp avoriq-postgres:/tmp/avoriq.dump ./avoriq-$(date +%F).dump

# Restore
docker cp ./avoriq-2026-06-19.dump avoriq-postgres:/tmp/
docker exec avoriq-postgres pg_restore -U avoriq -d avoriq --clean --if-exists /tmp/avoriq.dump
```

### Backup Ollama models (optional)

```bash
docker run --rm -v avoriq_backend_data_ollama:/data -v $(pwd):/backup alpine \
  tar czf /backup/ollama-models-$(date +%F).tar.gz /data
```

> The volume name in compose v2 is `<project>_<volume>`. Run `docker volume ls | grep ollama` to confirm.

### Update HF token

```bash
cd /opt/avoriq/avoriq/backend
nano .env              # paste new token
docker compose restart backend   # picks up new env
```

---

## 12. Monitoring & observability (basic)

### Disk + memory alerts

A simple cron job that emails you if disk > 80%:

```bash
sudo apt install -y mailutils
crontab -e
```

Add:

```
*/30 * * * * [ $(df / | tail -1 | awk '{print $5}' | tr -d '%') -gt 80 ] && echo "Disk >80% on $(hostname)" | mail -s "Alert: low disk" you@example.com
```

### Uptime check

Use a free external monitor (UptimeRobot, BetterStack, or Healthchecks.io):

```
https://avoriq.example.com/api/health
```

Configure it to ping every 5 minutes and alert you on 2 consecutive failures.

### Log rotation

Caddy already rotates its own log. For Docker logs, add to `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "50m",
    "max-file": "5"
  }
}
```

Then `sudo systemctl restart docker` (containers will keep running).

---

## 13. Hardening checklist

Before going live with real users, confirm:

- [ ] Root SSH disabled
- [ ] Password SSH disabled (key-only)
- [ ] UFW active, only 22/80/443 open
- [ ] fail2ban running (`sudo systemctl status fail2ban`)
- [ ] Unattended security updates enabled
- [ ] `.env` is `chmod 600` and not in git
- [ ] All `CHANGE_ME` replaced with real secrets
- [ ] Postgres only reachable on docker network (no host port exposed)
- [ ] Ollama only reachable on docker network (no host port exposed)
- [ ] Caddy TLS cert auto-renewed (`sudo systemctl status caddy.timer` or via the caddy service)
- [ ] HF token is **Read-scoped only** (not Write)
- [ ] Backups run nightly to off-VPS storage (S3, Backblaze B2)
- [ ] External uptime monitor configured
- [ ] GitHub repo private; no secrets committed (`git log --all -p | grep -i 'hf_api_token\|password'`)

---

## 14. gemma3:4b performance expectations on CPU

| Metric | Value |
|--------|-------|
| Model size on disk | ~3 GB (Q4_0 quantized) |
| RAM usage (loaded) | ~5 GB (weights + KV cache at 4k ctx) |
| First query after cold start | 30–60s (model loading from disk) |
| Steady-state first token | 1–3s |
| Token generation speed | 4–8 tok/s on 4 vCPU, 6–12 tok/s on 8 vCPU |
| Idle RAM after `OLLAMA_KEEP_ALIVE=10m` | ~0.3 GB (model unloaded) |

**Tips for best performance:**
- Keep `OLLAMA_NUM_PARALLEL=1` to avoid doubling KV cache
- Keep `OLLAMA_CONTEXT_LENGTH=4096` (halves KV cache vs default 8k)
- `OLLAMA_KEEP_ALIVE=10m` balances RAM recovery vs reload latency

---

## 15. Common Ubuntu-specific gotchas

### `iptables` vs UFW

Docker manipulates `iptables` directly. If you use UFW, you must enable forwarding in `/etc/ufw/sysctl.conf`:

```bash
# /etc/ufw/sysctl.conf
net/ipv4/ip_forward=1
net/ipv6/conf/default/forwarding=1
```

Then `sudo ufw reload`. Otherwise containers can't reach the internet (HF API calls fail).

### DNS inside containers

If HF API calls hang with DNS errors, hard-code a public DNS in `/etc/docker/daemon.json`:

```json
{
  "dns": ["1.1.1.1", "8.8.8.8"]
}
```

Then restart docker.

### `vm.max_map_count` for Postgres-heavy workloads

If you ever see Postgres `Cannot allocate memory` errors:

```bash
sudo sysctl -w vm.max_map_count=262144
echo "vm.max_map_count=262144" | sudo tee -a /etc/sysctl.conf
```

### Time zone

Set it explicitly — logs and cron are clearer:

```bash
sudo timedatectl set-timezone Asia/Kolkata
```

---

## 16. Cost summary

Approximate monthly cost for a small production deployment (AvorIQ V1, ~1k–10k users):

| Item                                    | Cost                |
|-----------------------------------------|---------------------|
| VPS (4 vCPU / 16 GB / 80 GB SSD)       | ~$40                |
| Domain (annual, ~$12/yr)                | ~$1                 |
| HF Inference API (free tier)            | $0                  |
| Backups (Backblaze B2, 50 GB)           | ~$0.25              |
| Email alerts (Mailgun free tier or SES) | $0                  |
| **Total**                               | **~$42/month**      |

If you outgrow the free HF Inference API tier (heavy embedding traffic), add a GPU VPS for local TEI.

For most hackathon / early-stage usage, the 4 vCPU + 16 GB VPS + free HF API tier is plenty.

---

## 17. Quick reference: all the commands in order

```bash
# ── One-time setup ──
apt update && apt upgrade -y
adduser deploy && usermod -aG sudo deploy
# (re-login as deploy)
sudo apt install -y ufw fail2ban unattended-upgrades
sudo ufw default deny incoming && sudo ufw default allow outgoing
sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp
sudo ufw enable
sudo dpkg-reconfigure -plow unattended-upgrades

# ── Docker ──
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker deploy && newgrp docker

# ── App ──
sudo mkdir -p /opt/avoriq && sudo chown deploy:deploy /opt/avoriq
cd /opt/avoriq
git clone https://github.com/adityatomar4877-rgb/AvorIQ.git .
cd avoriq/backend
nano .env              # paste config from section 6
chmod 600 .env

# ── Frontend .env.production ──
# (see section 7)

# ── Caddy ──
sudo apt install -y caddy
sudo nano /etc/caddy/Caddyfile   # paste config from section 8
sudo mkdir -p /var/log/caddy && sudo chown caddy:caddy /var/log/caddy
sudo systemctl enable caddy && sudo systemctl restart caddy

# ── Bring it up ──
cd /opt/avoriq/avoriq/backend
docker compose build frontend
docker compose up -d
docker exec avoriq-ollama ollama pull gemma3:4b
docker compose logs -f backend

# ── Smoke test ──
curl -s https://avoriq.example.com/api/health | jq
```
