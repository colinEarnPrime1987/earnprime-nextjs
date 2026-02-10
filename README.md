# EarnPrime

**Secure, transparent short-term investment platform** designed to help users grow their wealth with confidence through investment notes.

[![Version](https://img.shields.io/badge/version-0.2.0-green.svg)](https://github.com/colinEarnPrime1987/earnprime-nextjs)
[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black.svg)](https://nextjs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-5.x-white.svg)](https://fastify.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)

## Quick Start

```bash
# Frontend (Terminal 1)
npm install
npm run dev                  # http://localhost:3000

# Backend (Terminal 2)
cd backend
npm install
npm run dev                  # http://localhost:3002

# Database migrations (one-time)
psql <connection_string> -f backend/src/db/schema.sql
psql <connection_string> -f backend/src/db/migrate-notes.sql
```

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App    │────▶│  Fastify API     │────▶│ Aurora PostgreSQL│
│   (port 3000)    │     │  (port 3002)     │     │   (AWS RDS)      │
└─────────────────┘     └────────┬─────────┘     └─────────────────┘
                                 │
                         ┌───────▼────────┐
                         │   Plaid API     │
                         │   (Sandbox)     │
                         └────────────────┘
```

- **Frontend:** Next.js 16 with App Router, CSS Modules, TypeScript
- **Backend:** Fastify with TypeScript, Zod validation, JWT auth
- **Database:** Aurora PostgreSQL on AWS RDS
- **Banking:** Plaid sandbox integration for account linking
- **Encryption:** AES-256-GCM for sensitive tokens at rest

## Project Structure

```
earnprime-nextjs/
├── app/                              # Next.js App Router
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   ├── login/                       # Login page
│   ├── register/                    # Multi-step registration
│   ├── dashboard/                   # User dashboard
│   │   ├── page.tsx                # Main dashboard (banks, stats, invest)
│   │   ├── institution/[id]/       # Institution detail + account drill-down
│   │   └── notes/                  # Notes Marketplace
│   │       ├── page.tsx            # Browse all notes
│   │       ├── [id]/page.tsx       # Note detail + purchase form
│   │       └── purchases/page.tsx  # My Investments portfolio
│   └── api/plaid/                   # Next.js proxy routes for Plaid
│
├── backend/                          # Fastify API server
│   └── src/
│       ├── db/                      # Schema, migrations, connection
│       ├── middleware/              # JWT auth middleware
│       ├── repositories/           # Data access layer
│       ├── routes/                  # API route handlers
│       ├── services/               # Business logic
│       ├── types/                   # TypeScript interfaces
│       └── utils/                   # Encryption utilities
│
├── components/                       # Shared React components
│   ├── base/                        # EPButton, AnimatedBackground, etc.
│   ├── layout/                      # EPContainer
│   └── PlaidLink.tsx               # Plaid Link integration
│
├── lib/                              # Frontend utilities
│   ├── api-client.ts               # HTTP client for all API calls
│   └── plaid.ts                    # Plaid configuration
│
└── docs/                             # Documentation
    ├── user-guide.md               # Step-by-step user walkthrough
    └── plaid-integration-flow.md   # Plaid technical flow
```

## Features

### Authentication & Registration

- JWT-based authentication with bcrypt password hashing
- Multi-step registration wizard with KYC data collection
- Protected routes with auth middleware

### Plaid Banking Integration

- Connect bank accounts via Plaid Link (sandbox)
- View institutions, accounts, and balances
- Sync and browse transaction history
- Refresh live balances from Plaid
- Disconnect institutions
- Access tokens encrypted with AES-256-GCM at rest

### Notes Marketplace

- Browse investment notes with APY rates, terms, and risk ratings
- Real-time capacity tracking with progress bars
- Purchase notes using connected bank accounts
- Validation: minimum investment, capacity limits, account ownership
- Atomic database transactions for purchase integrity
- Dedicated "My Investments" portfolio page

### Dashboard

- Financial overview with total balance and account counts
- Institution cards with aggregated balances
- Cross-bank transaction feed
- Quick access to Notes Marketplace
- Drill-down: institution > accounts > transactions

## API Endpoints

### Authentication

| Method | Path                 | Auth | Description        |
| ------ | -------------------- | ---- | ------------------ |
| POST   | `/api/auth/register` | No   | Create account     |
| POST   | `/api/auth/login`    | No   | Login, returns JWT |
| GET    | `/api/auth/me`       | Yes  | Get current user   |

### Plaid / Banking

| Method | Path                                                    | Auth | Description           |
| ------ | ------------------------------------------------------- | ---- | --------------------- |
| POST   | `/api/plaid/create-link-token`                          | Yes  | Get Plaid Link token  |
| POST   | `/api/plaid/exchange-token`                             | Yes  | Exchange public token |
| GET    | `/api/plaid/accounts`                                   | Yes  | All user accounts     |
| GET    | `/api/plaid/balances`                                   | Yes  | Refresh all balances  |
| GET    | `/api/plaid/institutions`                               | Yes  | List connected banks  |
| GET    | `/api/plaid/institutions/:id/accounts`                  | Yes  | Accounts for a bank   |
| GET    | `/api/plaid/institutions/:id/balances`                  | Yes  | Refresh bank balances |
| GET    | `/api/plaid/institutions/:id/accounts/:id`              | Yes  | Account detail        |
| GET    | `/api/plaid/institutions/:id/accounts/:id/transactions` | Yes  | Account transactions  |
| GET    | `/api/plaid/institutions/:id/transactions`              | Yes  | All bank transactions |
| POST   | `/api/plaid/sync-transactions`                          | Yes  | Sync from Plaid       |
| GET    | `/api/plaid/transactions`                               | Yes  | All user transactions |
| DELETE | `/api/plaid/institutions/:id`                           | Yes  | Disconnect bank       |

### Notes Marketplace

| Method | Path                      | Auth | Description      |
| ------ | ------------------------- | ---- | ---------------- |
| GET    | `/api/notes`              | No   | List all notes   |
| GET    | `/api/notes/:id`          | No   | Note detail      |
| POST   | `/api/notes/:id/purchase` | Yes  | Purchase a note  |
| GET    | `/api/notes/purchases/me` | Yes  | User's purchases |

## Database Schema

| Table            | Description                                           |
| ---------------- | ----------------------------------------------------- |
| `users`          | User accounts with hashed passwords                   |
| `plaid_items`    | Connected bank institutions (encrypted access tokens) |
| `bank_accounts`  | Bank account details and balances                     |
| `transactions`   | Transaction history from Plaid                        |
| `notes`          | Investment notes with APY, capacity, risk             |
| `note_purchases` | User purchase records                                 |

## Design System

- **Primary Green:** `#00EA96`
- **Card Background:** `rgba(26, 26, 26, 0.95)` with `backdrop-filter: blur(20px)`
- **Card Border:** `rgba(0, 234, 150, 0.1)` with `border-radius: 16px`
- **Font:** Poppins (400, 500, 600, 700)
- **Dark theme** throughout with glass-morphism card effects

## Environment Variables

See `backend/.env.example` for the full list. Key variables:

```env
# Database (Aurora PostgreSQL)
DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

# Auth
JWT_SECRET

# Plaid (Sandbox)
PLAID_CLIENT_ID, PLAID_SANDBOX_SECRET, PLAID_ENV=sandbox

# Encryption
ENCRYPTION_KEY    # 64-char hex key for AES-256-GCM

# URLs
FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3002
```

## Versioning

This project follows [Semantic Versioning](https://semver.org/). See [CHANGELOG.md](CHANGELOG.md) for version history.

## Documentation

- [User Guide](docs/user-guide.md) — Step-by-step: register, login, connect banks, purchase notes
- [Plaid Integration Flow](docs/plaid-integration-flow.md) — Technical Plaid flow details
- [Phase 1: Authentication](docs/PHASE-1-AUTHENTICATION.md) — Original auth implementation docs

## License

Copyright 2026 EarnPrime. All rights reserved.

---

**Current Version**: 0.2.0
**Last Updated**: February 7, 2026
