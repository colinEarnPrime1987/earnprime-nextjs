# EarnPrime Project Memory

## Architecture
- **Frontend**: Next.js (port 3000), React 19
- **Backend**: Fastify (port 3002), TypeScript with tsx watch
- **Database**: AWS RDS Aurora PostgreSQL (earnprime-db-dev cluster, us-east-2)
- **Plaid SDK**: v29.0.0 (backend), v41.1.0 (frontend) — version mismatch exists

## Key Learnings

### Plaid Integration (2026-02-07)
- Backend uses `tsx watch` for hot reload — .env changes may need manual restart
- **Env var timing**: Plaid client was initialized at module-load time before `dotenv.config()` ran. Fixed with lazy initialization (`getPlaidClient()` singleton pattern)
- **DB schema**: `plaid_items.user_id` is UUID type with FK to `users.id` — sandbox test user must be a valid UUID in the users table
- **Sandbox test user**: UUID `00000000-0000-0000-0000-000000000001`, email `test@example.com`
- **optionalAuth middleware**: Falls back to sandbox test user when `PLAID_ENV=sandbox`
- All plaid routes use `optionalAuth` for sandbox testing (accounts, balances, transactions)
- **CORS**: `FRONTEND_URL` in `backend/.env` must match actual frontend port (3000, not 3001)
- **API client**: Don't send `Content-Type: application/json` on bodyless POST requests (Fastify rejects them)

## Database Tables
- `users`, `plaid_items`, `bank_accounts`, `transactions`
- Sandbox data loaded: 12 accounts, 48 transactions from First Platypus Bank

## Files Modified (Plaid fixes)
- `backend/src/services/plaid.service.ts` — lazy Plaid client init
- `backend/src/middleware/auth.middleware.ts` — consistent UUID for sandbox user
- `backend/src/routes/plaid.routes.ts` — all routes use optionalAuth
- `backend/.env` — FRONTEND_URL port fix
- `.env.local` — NEXTAUTH_URL port fix
- `lib/api-client.ts` — Content-Type only with body
