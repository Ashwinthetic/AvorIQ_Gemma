# AvorIQ — Production VPS Deployment & Database Seeding Guide

This guide describes how to deploy the AvorIQ application (FastAPI + Next.js + Postgres/pgvector + Ollama) to a clean Ubuntu VPS and load your scholarship datasets. 

It covers running embeddings **offline using Ollama**, avoiding any Hugging Face network or DNS errors.

---

## 1. Prerequisites & Specifications
* **OS**: Ubuntu 22.04 LTS or 24.04 LTS (64-bit)
* **Hardware Requirements**:
  * **Minimum**: 4 vCPUs, 8 GB RAM (Floor spec for running `gemma3:4b` + `bge-m3` embeddings locally)
  * **Recommended**: 4 vCPUs, 16 GB RAM (Ensures no memory crashes during concurrent search and chat operations)
* **Ports**: Open ports `22` (SSH), `80` (HTTP), and `443` (HTTPS) on your firewall.

---

## 2. Server Setup & Hardening

1. Update system dependencies:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y ufw fail2ban unattended-upgrades
   ```

2. Configure the UFW firewall:
   ```bash
   sudo ufw default deny incoming
   sudo ufw default allow outgoing
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. Install Docker and Docker Compose:
   ```bash
   curl -fsSL https://get.docker.com | sudo sh
   sudo usermod -aG docker $USER
   newgrp docker
   ```

---

## 3. Clone Repository & Setup Environment

1. Clone your project to `/opt/avoriq`:
   ```bash
   sudo mkdir -p /opt/avoriq
   sudo chown $USER:$USER /opt/avoriq
   cd /opt/avoriq
   git clone https://github.com/adityatomar4877-rgb/AvorIQ.git .
   ```

2. Configure the Backend Environment File:
   Create `/opt/avoriq/avoriq/backend/.env`:
   ```bash
   nano /opt/avoriq/avoriq/backend/.env
   ```
   **Paste the following configuration**:
   ```env
   # ── Database ──
   # Note: Replace 'YOUR_DB_SECRET' with a secure random password
   DATABASE_URL=postgresql+asyncpg://avoriq:YOUR_DB_SECRET@postgres:5432/avoriq
   POSTGRES_PASSWORD=YOUR_DB_SECRET

   # ── Ollama Chat & Embeddings ──
   OLLAMA_BASE_URL=http://ollama:11434
   CHAT_MODEL=gemma3:4b
   OLLAMA_PUBLIC_URL=http://localhost:11435
   CHAT_CONTEXT_LENGTH=4096
   CHAT_MAX_TOKENS=512

   # ── Local Embedding Configuration ──
   EMBEDDING_PRIMARY=ollama
   EMBEDDING_MODEL=bge-m3
   EMBEDDING_DIM=1024

   # ── Public URLs ──
   # Replace with your actual domain name
   NEXT_PUBLIC_API_URL=https://avoriq.yourdomain.com
   PUBLIC_BASE_URL=https://avoriq.yourdomain.com

   # ── CORS ──
   CORS_ORIGINS=https://avoriq.yourdomain.com,http://localhost:3000
   ```

3. Update the password in `docker-compose.yml`:
   In `/opt/avoriq/avoriq/backend/docker-compose.yml`, update the `POSTGRES_PASSWORD` environment variable for the `postgres` service to match the `YOUR_DB_SECRET` used above.

4. Create the Frontend Production Environment File:
   Create `/opt/avoriq/avoriq/frontend/.env.production`:
   ```bash
   nano /opt/avoriq/avoriq/frontend/.env.production
   ```
   **Add the API endpoint**:
   ```env
   NEXT_PUBLIC_API_URL=https://avoriq.yourdomain.com
   ```

---

## 4. Run the Application

1. Build the production Next.js frontend image:
   ```bash
   cd /opt/avoriq/avoriq/backend
   
   ```

2. Start all containers in background mode:
   ```bash
   docker compose up -d
   ```

3. Pull the required Gemma model for the chat service:
   ```bash
   docker exec avoriq-ollama ollama pull gemma3:4b
   ```

---

## 5. Database Uploading & Seeding

### Method A: Seeding using a CSV file (e.g., `india_scholarships_mock_100.csv`)

If you want to upload a CSV dataset from your local machine and import it into the vector database:

1. **Upload the CSV file to the VPS**:
   On your **local machine**, upload the CSV using `scp`:
   ```bash
   scp path/to/india_scholarships_mock_100.csv user@your-server-ip:/opt/avoriq/avoriq/backend/
   ```

2. **Verify files on the VPS**:
   On the **VPS**, make sure the file is in the backend directory:
   ```bash
   cd /opt/avoriq/avoriq/backend/
   ls -la india_scholarships_mock_100.csv
   ```

3. **Import and embed the CSV inside the Docker container**:
   Since the backend container binds the current directory to `/app`, the CSV is available at `/app/india_scholarships_mock_100.csv`. Execute the importer inside the container:
   ```bash
   docker exec avoriq-backend python -m app.csv_loader --csv /app/india_scholarships_mock_100.csv
   ```
   *The loader will connect locally to Ollama, download the `bge-m3` model if not already present, generate 1024-dimension embeddings, and insert the records into PostgreSQL.*

---

### Method B: Uploading and Restoring a PostgreSQL Backup (`.dump` file)

If you have a binary backup of a previously seeded database and want to restore it directly:

1. **Upload the `.dump` file to the VPS**:
   From your **local machine**:
   ```bash
   scp path/to/avoriq_backup.dump user@your-server-ip:/opt/avoriq/avoriq/backend/
   ```

2. **Copy the dump file into the Postgres container**:
   On the **VPS**:
   ```bash
   docker cp /opt/avoriq/avoriq/backend/avoriq_backup.dump avoriq-postgres:/tmp/avoriq_backup.dump
   ```

3. **Restore the dump into the database**:
   Run the postgres restore utility inside the container:
   ```bash
   docker exec -it avoriq-postgres pg_restore -U avoriq -d avoriq --clean --if-exists /tmp/avoriq_backup.dump
   ```

4. **(Optional) Backing up the database in the future**:
   To create a new backup of your PostgreSQL database:
   ```bash
   docker exec avoriq-postgres pg_dump -U avoriq -d avoriq -Fc -f /tmp/avoriq.dump
   docker cp avoriq-postgres:/tmp/avoriq.dump ./avoriq-$(date +%F).dump
   ```

---

## 6. Configure SSL & Domain Routing (Caddy)

Caddy acts as your reverse proxy and will automatically handle Let's Encrypt SSL certificate provisioning and renewal.

1. Install Caddy on the VPS host:
   ```bash
   sudo apt install -y caddy
   ```

2. Edit the Caddyfile:
   ```bash
   sudo nano /etc/caddy/Caddyfile
   ```

3. Replace the contents with the following:
   ```caddyfile
   avoriq.yourdomain.com {
       encode zstd gzip

       # Route API traffic to FastAPI backend container (port 8000)
       handle /api/* {
           reverse_proxy 127.0.0.1:8000 {
               header_up Host {host}
               header_up X-Real-IP {remote_host}
               header_up X-Forwarded-For {remote_host}
               header_up X-Forwarded-Proto {scheme}
           }
       }

       # Route all other traffic to Next.js frontend container (port 3000)
       handle {
           reverse_proxy 127.0.0.1:3000
       }

       # Secure headers
       header {
           Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
           X-Content-Type-Options "nosniff"
           X-Frame-Options "DENY"
           Referrer-Policy "strict-origin-when-cross-origin"
       }
   }
   ```

4. Restart Caddy to apply changes:
   ```bash
   sudo systemctl restart caddy
   ```

Now, navigating to `https://avoriq.yourdomain.com` will serve the secure production app.
