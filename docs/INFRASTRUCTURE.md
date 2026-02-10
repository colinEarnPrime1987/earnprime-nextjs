# EarnPrime Infrastructure Setup

Complete documentation of the production infrastructure for earnprime.org.

## Architecture Overview

```
                         ┌──────────────────────────────────┐
                         │          Cloudflare DNS           │
                         │  earnprime.org → Vercel           │
                         │  api.earnprime.org → AWS ALB      │
                         └──────┬───────────────┬────────────┘
                                │               │
                    ┌───────────▼──┐    ┌───────▼──────────────┐
                    │   Vercel     │    │   AWS (us-east-2)     │
                    │              │    │                        │
                    │  Next.js     │    │  ALB (HTTPS:443)      │
                    │  Frontend    │    │       │                │
                    │  SSR + CDN   │    │  ECS Fargate          │
                    │              │    │  (Fastify :3002)      │
                    └──────────────┘    │       │                │
                                       │  Aurora PostgreSQL     │
                                       │  (RDS :5432)           │
                                       └────────────────────────┘
```

## Components

### 1. Frontend — Vercel

**What:** Next.js 16 app hosted on Vercel's edge network.

**Why Vercel:**
- Built by the Next.js team — first-class SSR, edge caching, and CDN support
- Zero-ops deployment: push to `main` and it deploys automatically
- Free SSL, global CDN, instant rollbacks

**Configuration:**
- GitHub repo: `colinEarnPrime1987/earnprime-nextjs`
- Branch: `main` (auto-deploy on push)
- Framework preset: Next.js (auto-detected)
- Root directory: `/` (frontend is at repo root)

**Environment variables (Vercel dashboard):**
| Variable | Description |
|----------|-------------|
| `GOOGLE_CLIENT_ID` | Google OAuth client ID for Workspace SSO |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXTAUTH_URL` | `https://earnprime.org` |
| `NEXTAUTH_SECRET` | Random secret for NextAuth JWT signing |
| `NEXT_PUBLIC_API_URL` | `https://api.earnprime.org` |

**Custom domain:** `earnprime.org` added in Vercel Settings → Domains.

---

### 2. Backend — AWS ECS Fargate

**What:** Fastify API server running in a Docker container on AWS Fargate.

**Why Fargate (vs EC2):**
- No servers to patch, maintain, or SSH into — smaller attack surface
- Auto-scaling without managing instances
- Better for compliance audits (no host-level access)
- Pay only for the CPU/memory your container uses

**Resources created:**

| Resource | Name/ID | Purpose |
|----------|---------|---------|
| ECR Repository | `earnprime-backend` | Stores Docker images |
| ECS Cluster | `earnprime` | Logical grouping for services |
| ECS Service | `earnprime-backend` | Manages desired task count and rolling deploys |
| Task Definition | `earnprime-backend` | Container config (image, ports, secrets, health check) |
| CloudWatch Log Group | `/ecs/earnprime-backend` | Container stdout/stderr logs |

**Task definition specs:**
- CPU: 256 (0.25 vCPU)
- Memory: 512 MB
- Container port: 3002
- Health check: `GET /health` every 30s
- Image: `405876601855.dkr.ecr.us-east-2.amazonaws.com/earnprime-backend:latest`

---

### 3. Load Balancer — Application Load Balancer (ALB)

**What:** Internet-facing ALB that terminates HTTPS and routes to Fargate.

**Why ALB:**
- HTTPS termination with ACM certificate (free, auto-renewing)
- Health checks route traffic only to healthy containers
- Required for Fargate services to receive external traffic

**Resources created:**

| Resource | Name/ID | Purpose |
|----------|---------|---------|
| ALB | `earnprime-api-alb` | Internet-facing load balancer |
| Target Group | `earnprime-api-tg` | Routes to Fargate tasks on port 3002 |
| HTTPS Listener | Port 443 | Forwards to target group with ACM cert |
| HTTP Listener | Port 80 | 301 redirect to HTTPS |
| ACM Certificate | `api.earnprime.org` | SSL/TLS for the API subdomain |

**ALB DNS:** `earnprime-api-alb-1436515790.us-east-2.elb.amazonaws.com`

---

### 4. Networking & Security

**VPC:** `vpc-0408aa0006b94e4d7` (172.31.0.0/16) — same VPC as Aurora.

**Subnets (all public, across 3 AZs):**
| Subnet | AZ | CIDR |
|--------|----|------|
| `subnet-0943a0154d0e83214` | us-east-2a | 172.31.0.0/20 |
| `subnet-0d083f19d73bf5855` | us-east-2b | 172.31.16.0/20 |
| `subnet-072b41c5385b216a9` | us-east-2c | 172.31.32.0/20 |

**Security groups — traffic flows in one direction only:**

```
Internet → [sg: earnprime-alb-sg] → [sg: earnprime-fargate-sg] → [sg: Aurora DB sg]
           port 80/443 from 0.0.0.0    port 3002 from ALB SG       port 5432 from Fargate SG
```

| Security Group | ID | Inbound Rules |
|----------------|----|---------------|
| `earnprime-alb-sg` | `sg-05201ca75de1d2cdc` | TCP 443 from 0.0.0.0/0, TCP 80 from 0.0.0.0/0 |
| `earnprime-fargate-sg` | `sg-0a1aae49f119a262e` | TCP 3002 from `earnprime-alb-sg` only |
| Aurora DB SG | `sg-01a6bb178e4b1ac6a` | TCP 5432 from `earnprime-fargate-sg` |

**Why this matters:** Each layer can only be reached from the layer above. The database is never exposed to the internet — only Fargate containers can connect.

---

### 5. Secrets Management — AWS Secrets Manager

**What:** All sensitive environment variables stored in Secrets Manager, injected into the container at runtime.

**Why (vs .env files):**
- No secrets baked into Docker images or stored on disk
- Auditable — every access is logged in CloudTrail
- Rotatable without redeploying
- Required for compliance (SOC 2, etc.)

**Secret name:** `earnprime/backend/prod`
**ARN:** `arn:aws:secretsmanager:us-east-2:405876601855:secret:earnprime/backend/prod-rc6rc0`

**Keys stored:**
| Key | Description |
|-----|-------------|
| `PORT` | Server port (3002) |
| `NODE_ENV` | `production` |
| `DB_HOST` | Aurora cluster endpoint |
| `DB_PORT` | 5432 |
| `DB_NAME` | Database name |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `JWT_SECRET` | JWT signing key (generated, production-strength) |
| `PLAID_CLIENT_ID` | Plaid API client ID |
| `PLAID_SANDBOX_SECRET` | Plaid sandbox secret key |
| `PLAID_ENV` | `sandbox` (change to `production` when ready) |
| `ENCRYPTION_KEY` | AES-256-GCM key for encrypting Plaid access tokens |
| `FRONTEND_URL` | `https://earnprime.org` (used for CORS) |

**To update a secret:**
```bash
aws secretsmanager update-secret \
  --secret-id earnprime/backend/prod \
  --region us-east-2 \
  --secret-string '{"KEY":"new-value", ...}'
```
Then force a new ECS deployment to pick up the change.

---

### 6. DNS — Cloudflare

**Why Cloudflare:** Domain was already managed here. Provides DDoS protection and fast DNS resolution.

**DNS records for the application:**

| Type | Name | Value | Proxy |
|------|------|-------|-------|
| A | `@` (earnprime.org) | `76.76.21.21` | DNS only |
| CNAME | `www` | `cname.vercel-dns.com` | DNS only |
| CNAME | `api` | `earnprime-api-alb-...elb.amazonaws.com` | DNS only |
| CNAME | `_4808a27...api` | ACM validation record | DNS only |

**Important:** All application records must be **DNS only** (grey cloud, not orange). Cloudflare's proxy conflicts with Vercel's SSL and AWS ALB's certificates.

**Records NOT to touch:** MX (Google Workspace email), NS, TXT (SPF/verification), `pay` CNAME.

---

### 7. IAM — Access Control

**IAM Group:** `EarnPrimeAdmins`

**Attached policies:**
| Policy | Purpose |
|--------|---------|
| `AmazonECS_FullAccess` | Manage ECS clusters, services, task definitions |
| `AmazonEC2ContainerRegistryFullAccess` | Push/pull Docker images to ECR |
| `SecretsManagerReadWrite` | Create and update secrets |
| `ElasticLoadBalancingFullAccess` | Manage ALB, target groups, listeners |
| `AmazonVPCReadOnlyAccess` | View VPC and subnet info |
| `IAMFullAccess` | Create ECS task execution roles |
| `AWSCertificateManagerFullAccess` | Request and manage SSL certificates |
| `CloudWatchLogsReadOnlyAccess` | Read container logs |

**IAM User:** `colin-cli` (CLI access only, member of `EarnPrimeAdmins`)

**ECS Execution Role:** `earnprime-ecs-execution-role`
- Trusted by: `ecs-tasks.amazonaws.com`
- Policies: `AmazonECSTaskExecutionRolePolicy` (ECR pull + CloudWatch logs), `SecretsManagerReadWrite` (read secrets at task startup)

---

### 8. Authentication Flow

Only `@earnprime.org` Google Workspace accounts can access the application.

**Enforcement layers:**
1. **Google OAuth `hd` parameter** — Google's account picker only shows workspace accounts
2. **NextAuth `signIn` callback** — Server-side check rejects emails not ending in `@earnprime.org`
3. **Next.js middleware** — All routes (except `/login` and `/api/auth/*`) require a valid NextAuth session
4. **Email/password login disabled** — Only Google SSO is active (preserved in comments for future production use)

**Google OAuth console settings:**
- Authorized redirect URI: `https://earnprime.org/api/auth/callback/google`

---

## Common Operations

### Deploy frontend changes
```bash
git push origin main
# Vercel auto-deploys from main branch
```

### Deploy backend changes
```bash
# 1. Build and push new image
cd backend
docker build -t earnprime-backend .
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 405876601855.dkr.ecr.us-east-2.amazonaws.com
docker tag earnprime-backend:latest 405876601855.dkr.ecr.us-east-2.amazonaws.com/earnprime-backend:latest
docker push 405876601855.dkr.ecr.us-east-2.amazonaws.com/earnprime-backend:latest

# 2. Force new deployment
aws ecs update-service --cluster earnprime --service earnprime-backend --force-new-deployment --region us-east-2
```

### View backend logs
```bash
# Get latest log stream
STREAM=$(aws logs describe-log-streams --log-group-name /ecs/earnprime-backend --order-by LastEventTime --descending --limit 1 --region us-east-2 --query 'logStreams[0].logStreamName' --output text)

# Read logs
aws logs get-log-events --log-group-name /ecs/earnprime-backend --log-stream-name "$STREAM" --region us-east-2 --query 'events[*].message' --output json
```

### Check backend health
```bash
curl https://api.earnprime.org/health
```

### Update secrets
```bash
# Update a secret value
aws secretsmanager update-secret \
  --secret-id earnprime/backend/prod \
  --region us-east-2 \
  --secret-string '{ ... full JSON with all keys ... }'

# Redeploy to pick up changes
aws ecs update-service --cluster earnprime --service earnprime-backend --force-new-deployment --region us-east-2
```

### Scale the backend
```bash
# Scale to 2 tasks
aws ecs update-service --cluster earnprime --service earnprime-backend --desired-count 2 --region us-east-2
```

---

## Cost Estimate (monthly)

| Service | Estimated Cost |
|---------|---------------|
| Vercel (Pro) | $0-20 |
| ECS Fargate (0.25 vCPU, 512MB, 1 task) | ~$10-15 |
| ALB | ~$16 + $0.008/LCU-hour |
| Aurora PostgreSQL (existing) | Already running |
| ACM Certificate | Free |
| Secrets Manager (1 secret) | ~$0.40 |
| CloudWatch Logs | ~$0.50/GB ingested |
| ECR (image storage) | ~$0.10/GB |
| **Total (approx)** | **~$30-55/month** |

---

## AWS Resource Reference

| Resource | Identifier |
|----------|-----------|
| AWS Account ID | `405876601855` |
| Region | `us-east-2` (Ohio) |
| VPC | `vpc-0408aa0006b94e4d7` |
| ECR Repo URI | `405876601855.dkr.ecr.us-east-2.amazonaws.com/earnprime-backend` |
| ECS Cluster | `earnprime` |
| ECS Service | `earnprime-backend` |
| ALB DNS | `earnprime-api-alb-1436515790.us-east-2.elb.amazonaws.com` |
| ACM Cert ARN | `arn:aws:acm:us-east-2:405876601855:certificate/d4ca0a08-17da-4980-99f8-a4b1f8330aee` |
| Secret ARN | `arn:aws:secretsmanager:us-east-2:405876601855:secret:earnprime/backend/prod-rc6rc0` |
| ALB SG | `sg-05201ca75de1d2cdc` |
| Fargate SG | `sg-0a1aae49f119a262e` |
| Aurora SG | `sg-01a6bb178e4b1ac6a` |
| ECS Execution Role | `earnprime-ecs-execution-role` |
| IAM Group | `EarnPrimeAdmins` |
| IAM User | `colin-cli` |
