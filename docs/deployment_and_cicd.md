# 🚀 AvorIQ CI/CD & Deployment Guide

This guide details how to set up and configure the automated **CI/CD Pipeline** using **GitHub Actions** and **Docker Compose**. With this setup, pushing to the `main` branch will automatically validate your code, connect to your server, pull the latest changes, rebuild the containers, and prune unused images.

---

## 🛠️ How It Works

```mermaid
graph TD
    A[Push to main branch] --> B[GitHub Actions Triggered]
    B --> C[Validate Codebase CI]
    C -->|Installs & Lints Next.js| D[Frontend Lint Check]
    C -->|Compiles python files| E[Backend Syntax Check]
    D --> F{Checks Pass?}
    E --> F
    F -- No --> G[Stop Deployment & Notify]
    F -- Yes --> H[Deploy to Server CD]
    H -->|SSH Connect via Private Key| I[cd ~/AvorIQ && Execute scripts/deploy.sh]
    I -->|1. git reset & pull| J[Pull Latest Code]
    I -->|2. docker compose up -d --build| K[Rebuild & Restart Containers]
    I -->|3. docker image prune -f| L[Prune Unused Images]
    K --> M[Services Live & Verified]
    L --> M
```

---

## 🔑 Step 1: Set up SSH Keys for GitHub Actions

To allow GitHub Actions to securely log into your VPS without a password, you must use an SSH keypair.

### 1. Generate a New SSH Keypair
Log into your local machine or the VPS itself and run:
```bash
ssh-keygen -t ed25519 -C "github-actions-avoriq" -f ~/.ssh/id_github_avoriq
```
*Press Enter to skip adding a passphrase (it must be empty so GitHub Actions can run non-interactively).*

### 2. Install the Public Key on the VPS
Add the contents of the public key (`~/.ssh/id_github_avoriq.pub`) to the target deployment user's `authorized_keys` file on the VPS:
```bash
# Log in to your VPS and run:
mkdir -p ~/.ssh
chmod 700 ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the content of id_github_avoriq.pub on a new line and save.
chmod 600 ~/.ssh/authorized_keys
```

> [!IMPORTANT]
> Keep the private key (`~/.ssh/id_github_avoriq`) secret. Do not commit it to Git or share it. You will paste this private key into GitHub Secrets.

---

## ⚙️ Step 2: Configure GitHub Repository Secrets

GitHub Secrets store your sensitive credentials encrypted. 

1. Go to your GitHub Repository: `Settings` → `Secrets and variables` → `Actions`.
2. Click **New repository secret** and add the following four secrets:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| **`SSH_HOST`** | The public IP address or domain name of your VPS | `192.0.2.1` or `avoriq.example.com` |
| **`SSH_USERNAME`** | The user you use to log in (e.g. `root` or a deploy user) | `root` |
| **`SSH_PRIVATE_KEY`** | The **entire** contents of the private key `id_github_avoriq` | `-----BEGIN OPENSSH PRIVATE KEY-----...` |
| **`SSH_PORT`** | The SSH port configured on your VPS (Optional, defaults to `22`) | `22` |

---

## ⚙️ Step 3: Server Permissions (Recommended)

If you are deploying using a non-root user (e.g. `deploy`), ensure this user has permissions to run Docker commands and access the installation folder:

```bash
# Add deploy user to docker group
sudo usermod -aG docker deploy

# Change ownership of the installation directory to the deploy user
sudo chown -R deploy:deploy ~/AvorIQ
```
*(After modifying groups, log out and log back in to apply the group changes).*

---

## 🚀 Step 4: Try a Test Run!

1. Commit and push the new files to GitHub:
   ```bash
   git add .github/workflows/deploy.yml scripts/deploy.sh docs/deployment_and_cicd.md
   git commit -m "docs & setup: integrate automated CI/CD pipeline"
   git push origin main
   ```
2. Navigate to the **Actions** tab on your GitHub repository.
3. You will see the **AvorIQ CI/CD Pipeline** running!
4. Click on the workflow run to view real-time logs for both the validation phase and the remote deployment commands.

---

## 🧹 Maintenance & Best Practices

> [!TIP]
> **Docker Cleanup:** Rebuilding Docker images continuously creates "dangling" or unused images that eat disk space. The deployment script includes `docker image prune -f` at the end to clean these up automatically.
> 
> If you ever run out of disk space, run this manually on the server:
> ```bash
> docker system prune -af --volumes
> ```

> [!WARNING]
> **Port Conflicts:** Ensure that no other services on the VPS are listening on ports `3000`, `8000`, `5432`, or `11435`.
