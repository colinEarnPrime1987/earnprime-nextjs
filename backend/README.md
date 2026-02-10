# EarnPrime Backend API

Fastify API server for EarnPrime with JWT auth, Plaid banking integration, and Notes Marketplace.

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3002
```

## Project Structure

```
backend/src/
├── db/
│   ├── connection.ts              # PostgreSQL pool + query helpers
│   ├── schema.sql                 # Core tables (users, plaid_items, bank_accounts, transactions)
│   └── migrate-notes.sql          # Notes marketplace tables + seed data
├── middleware/
│   └── auth.middleware.ts         # JWT verification (optionalAuth)
├── repositories/
│   ├── user.repository.ts        # User CRUD
│   ├── plaid.repository.ts       # Plaid items, accounts, transactions
│   └── notes.repository.ts       # Notes + atomic purchase transactions
├── routes/
│   ├── auth.routes.ts             # Register, login, me
│   ├── plaid.routes.ts            # Plaid Link, accounts, balances, transactions
│   └── notes.routes.ts            # Notes listing, detail, purchase, user purchases
├── services/
│   ├── auth.service.ts            # Password hashing, JWT generation
│   ├── plaid.service.ts           # Plaid API calls + data sync
│   └── notes.service.ts           # Purchase validation + orchestration
├── types/
│   └── index.ts                   # All TypeScript interfaces
├── utils/
│   └── crypto.ts                  # AES-256-GCM encrypt/decrypt
└── server.ts                      # Fastify setup, CORS, route registration
```

## API Endpoints

### Health

- `GET /health` — Server + database status

### Auth (`/api/auth`)

| Method | Path        | Auth | Description                      |
| ------ | ----------- | ---- | -------------------------------- |
| POST   | `/register` | No   | Create account (email, password) |
| POST   | `/login`    | No   | Login, returns JWT token         |
| GET    | `/me`       | Yes  | Get current user profile         |

### Plaid (`/api/plaid`)

| Method | Path                                          | Auth | Description                           |
| ------ | --------------------------------------------- | ---- | ------------------------------------- |
| POST   | `/create-link-token`                          | Yes  | Generate Plaid Link token             |
| POST   | `/exchange-token`                             | Yes  | Exchange public token, store accounts |
| GET    | `/accounts`                                   | Yes  | All user bank accounts                |
| GET    | `/balances`                                   | Yes  | Refresh balances from Plaid           |
| POST   | `/sync-transactions`                          | Yes  | Sync transactions from Plaid          |
| GET    | `/transactions`                               | Yes  | All user transactions                 |
| GET    | `/institutions`                               | Yes  | List connected institutions           |
| GET    | `/institutions/:id/accounts`                  | Yes  | Accounts for an institution           |
| GET    | `/institutions/:id/balances`                  | Yes  | Refresh institution balances          |
| GET    | `/institutions/:id/accounts/:id`              | Yes  | Single account detail                 |
| GET    | `/institutions/:id/accounts/:id/transactions` | Yes  | Account transactions                  |
| GET    | `/institutions/:id/transactions`              | Yes  | Institution transactions              |
| DELETE | `/institutions/:id`                           | Yes  | Disconnect institution                |

### Notes (`/api/notes`)

| Method | Path                | Auth | Description               |
| ------ | ------------------- | ---- | ------------------------- |
| GET    | `/`                 | No   | List all investment notes |
| GET    | `/purchases/me`     | Yes  | User's purchase history   |
| GET    | `/:noteId`          | No   | Note detail               |
| POST   | `/:noteId/purchase` | Yes  | Purchase a note           |

**Purchase request body:**

```json
{
  "bank_account_id": "uuid",
  "amount": 1000.0
}
```

**Purchase validations:**

- Note must exist and be `active`
- Amount >= note's `min_investment`
- Amount <= remaining capacity (`max_capacity - current_invested`)
- Bank account must belong to the authenticated user

## Database

### Tables

| Table            | Purpose                                                  |
| ---------------- | -------------------------------------------------------- |
| `users`          | User accounts (email, bcrypt password hash)              |
| `plaid_items`    | Connected institutions (encrypted access tokens)         |
| `bank_accounts`  | Account details and balances                             |
| `transactions`   | Transaction history synced from Plaid                    |
| `notes`          | Investment notes (APY, capacity, risk, status)           |
| `note_purchases` | Purchase records linking users, notes, and bank accounts |

### Running Migrations

```bash
# Core schema
psql <connection_string> -f src/db/schema.sql

# Notes marketplace
psql <connection_string> -f src/db/migrate-notes.sql
```

## Security

- **Passwords:** bcrypt hashed
- **Access tokens:** AES-256-GCM encrypted at the repository layer
- **Auth:** JWT tokens via `Authorization: Bearer <token>` header
- **Purchases:** Atomic DB transactions (BEGIN/COMMIT/ROLLBACK)
- **Validation:** Zod schemas on all request bodies

## Environment Variables

Copy `.env.example` to `.env`:

```env
PORT=3002
NODE_ENV=development
DB_HOST=your-rds-endpoint
DB_PORT=5432
DB_NAME=your-database
DB_USER=your-user
DB_PASSWORD=your-password
JWT_SECRET=your-jwt-secret
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SANDBOX_SECRET=your-plaid-secret
PLAID_ENV=sandbox
ENCRYPTION_KEY=64-char-hex-key
FRONTEND_URL=http://localhost:3000
```
