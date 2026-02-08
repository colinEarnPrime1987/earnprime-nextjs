# Plaid Integration Flow — EarnPrime

This document walks through the complete Plaid integration, from the user clicking "Connect Bank Account" to seeing their transactions on the dashboard.

---

## Architecture Overview

```
┌──────────────────────┐     ┌─────────────────────┐     ┌─────────────┐
│  Next.js Frontend    │────▶│  Fastify Backend     │────▶│  Plaid API  │
│  (port 3000)         │     │  (port 3002)         │     │  (sandbox)  │
│                      │     │                      │     │             │
│  PlaidLink component │     │  PlaidService        │     │  Link       │
│  apiClient           │     │  PlaidRepository     │     │  Tokens     │
│  Dashboard page      │     │  crypto (encrypt)    │     │  Accounts   │
└──────────────────────┘     └──────────┬───────────┘     │  Balances   │
                                        │                 │  Txns       │
                                        ▼                 └─────────────┘
                              ┌─────────────────────┐
                              │  Aurora PostgreSQL   │
                              │  (AWS RDS)           │
                              │                      │
                              │  plaid_items         │
                              │  bank_accounts       │
                              │  transactions        │
                              └──────────────────────┘
```

---

## Step-by-Step Flow

### Phase 1: Link Token Creation

**Goal:** Get a temporary token from Plaid that initializes the Plaid Link UI widget.

```
User opens Dashboard
      │
      ▼
PlaidLink component mounts (components/PlaidLink.tsx)
      │
      ▼ useEffect calls apiClient.createLinkToken()
      │
      ▼ POST /api/plaid/create-link-token
      │  (Fastify route in routes/plaid.routes.ts)
      │  Auth: JWT from localStorage via optionalAuth middleware
      │
      ▼ PlaidService.createLinkToken(userId)
      │  (services/plaid.service.ts)
      │
      ▼ Plaid API: plaidClient.linkTokenCreate({
      │    user: { client_user_id: userId },
      │    client_name: 'EarnPrime',
      │    products: [Auth, Transactions],
      │    country_codes: [US],
      │    language: 'en'
      │  })
      │
      ▼ Response: { link_token: "link-sandbox-...", expiration: "2026-..." }
      │
      ▼ PlaidLink component stores link_token in state
      │  Passes it to usePlaidLink() hook from react-plaid-link
      │  Button becomes enabled (ready = true)
```

**Key files:**
- `components/PlaidLink.tsx` — React component wrapping Plaid Link
- `lib/api-client.ts` — `apiClient.createLinkToken()` makes the HTTP call
- `backend/src/routes/plaid.routes.ts` — `/create-link-token` endpoint
- `backend/src/services/plaid.service.ts` — `createLinkToken()` calls Plaid API

---

### Phase 2: User Connects Bank via Plaid Link

**Goal:** User authenticates with their bank through Plaid's hosted UI.

```
User clicks "Connect Bank Account"
      │
      ▼ PlaidLink.handleClick() → open()
      │  (opens Plaid Link modal — this is Plaid's own UI, not ours)
      │
      ▼ User selects a bank (e.g., Chase, Wells Fargo)
      │  User enters bank credentials
      │  (Sandbox: username "user_good", password "pass_good")
      │
      ▼ Plaid verifies credentials with the bank
      │
      ▼ Plaid Link calls onSuccess(public_token, metadata)
      │  public_token is a short-lived token (~30 min)
      │  metadata contains institution info
```

**What's happening behind the scenes at Plaid:**
- Plaid connects to the bank's API
- Verifies the user's credentials
- Creates an "Item" (a connection between user + bank)
- Returns a temporary `public_token` to exchange for a permanent `access_token`

---

### Phase 3: Token Exchange

**Goal:** Exchange the temporary public_token for a permanent access_token and store everything in our database.

```
onSuccess callback fires in Dashboard
      │
      ▼ apiClient.exchangePublicToken(publicToken)
      │
      ▼ POST /api/plaid/exchange-token { public_token: "public-sandbox-..." }
      │
      ▼ PlaidService.exchangePublicToken(userId, publicToken)
      │
      │  ┌─── Step 1: Exchange token ───────────────────────────────┐
      │  │ plaidClient.itemPublicTokenExchange({ public_token })    │
      │  │ Response: { access_token, item_id }                      │
      │  │ access_token = permanent key to access this bank account │
      │  └──────────────────────────────────────────────────────────┘
      │
      │  ┌─── Step 2: Get institution info ─────────────────────────┐
      │  │ plaidClient.itemGet({ access_token })                    │
      │  │ → Gets institution_id                                    │
      │  │ plaidClient.institutionsGetById({ institution_id })      │
      │  │ → Gets institution_name (e.g., "Chase")                  │
      │  └──────────────────────────────────────────────────────────┘
      │
      │  ┌─── Step 3: Store item in DB ─────────────────────────────┐
      │  │ plaidRepo.createItem({                                   │
      │  │   user_id, item_id, access_token, institution_*          │
      │  │ })                                                       │
      │  │                                                          │
      │  │ ⚡ ENCRYPTION: access_token is encrypted with            │
      │  │    AES-256-GCM before INSERT (see Encryption section)    │
      │  └──────────────────────────────────────────────────────────┘
      │
      │  ┌─── Step 4: Fetch & store accounts ───────────────────────┐
      │  │ plaidClient.accountsGet({ access_token })                │
      │  │ For each account:                                        │
      │  │   plaidRepo.createAccount({                              │
      │  │     account_id, name, type, subtype, mask,               │
      │  │     current_balance, available_balance, currency_code    │
      │  │   })                                                     │
      │  │ Uses ON CONFLICT (account_id) DO UPDATE for idempotency  │
      │  └──────────────────────────────────────────────────────────┘
      │
      ▼ Response to frontend:
        {
          item_id: "...",
          institution_name: "Chase",
          accounts: [{ id, name, type, subtype, mask }]
        }
```

**Key detail:** The `access_token` is the crown jewel — it provides permanent access to the user's bank data. It's encrypted at rest using AES-256-GCM in the `plaid_items` table.

---

### Phase 4: Fetching Accounts & Balances

**Goal:** Display the user's bank accounts and real-time balances.

```
Dashboard mounts (or after connecting a bank)
      │
      ▼ fetchData() fires — two parallel calls:
      │
      ├─▶ apiClient.getAccounts()
      │   GET /api/plaid/accounts
      │   → PlaidService.getAccounts(userId)
      │   → plaidRepo.findAccountsByUserId(userId)
      │   → Returns accounts from our DB (bank_accounts table)
      │
      └─▶ apiClient.getBalances()
          GET /api/plaid/balances
          → PlaidService.getBalances(userId)
          │
          ▼ For each plaid_item belonging to this user:
          │  (plaidRepo.findItemsByUserId → decrypt access_token)
          │
          ▼ plaidClient.accountsBalanceGet({ access_token })
          │  (This calls Plaid's API → calls the bank in real-time)
          │
          ▼ For each account in response:
          │  Update balance in our DB (plaidRepo.updateAccountBalances)
          │  Add to response array
          │
          ▼ Response:
            [{ account_id, name, type, subtype, mask,
               current_balance, available_balance, currency_code }]
```

**Important distinction:**
- `getAccounts()` reads from **our database** (fast, cached data)
- `getBalances()` calls **Plaid API → bank** in real-time (slower, live data) and updates our DB

---

### Phase 5: Transactions

**Goal:** Sync and display recent transactions.

```
User clicks "Load Transactions" on dashboard
      │
      ▼ handleLoadTransactions()
      │
      │  ┌─── Step 1: Sync from Plaid ──────────────────────────────┐
      │  │ apiClient.syncTransactions()                              │
      │  │ POST /api/plaid/sync-transactions                        │
      │  │ → PlaidService.syncTransactions(userId)                   │
      │  │                                                           │
      │  │ For each plaid_item:                                      │
      │  │   plaidClient.transactionsGet({                           │
      │  │     access_token,                                         │
      │  │     start_date: 90 days ago,                              │
      │  │     end_date: today,                                      │
      │  │     options: { count: 500, offset: 0 }                    │
      │  │   })                                                      │
      │  │                                                           │
      │  │   For each transaction:                                   │
      │  │     plaidRepo.createTransaction({                         │
      │  │       account_id, transaction_id, amount, date,           │
      │  │       name, merchant_name, category, pending, ...         │
      │  │     })                                                    │
      │  │     (ON CONFLICT updates amount and pending status)       │
      │  └───────────────────────────────────────────────────────────┘
      │
      │  ┌─── Step 2: Fetch from DB ─────────────────────────────────┐
      │  │ apiClient.getTransactions(20)                              │
      │  │ GET /api/plaid/transactions?limit=20                       │
      │  │ → PlaidService.getTransactions(userId, 20)                 │
      │  │ → plaidRepo.findTransactionsByUserId(userId, 20)           │
      │  │ → Returns 20 most recent transactions, ordered by date     │
      │  └───────────────────────────────────────────────────────────┘
      │
      ▼ Dashboard renders transaction list
        Each row shows: date, name, merchant, category, amount, pending badge
        Debit amounts (positive in Plaid) shown in red
        Credit amounts (negative in Plaid) shown in green
```

**Plaid amount convention:** Plaid uses positive amounts for debits (money going out) and negative for credits (money coming in). This is the opposite of what you might expect.

---

## Database Schema

### `plaid_items` — One row per bank connection
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | FK → users table |
| item_id | VARCHAR | Plaid's unique ID for this connection |
| access_token | TEXT | **Encrypted** (AES-256-GCM, format: `iv:authTag:ciphertext`) |
| institution_id | VARCHAR | Plaid institution ID (e.g., "ins_3") |
| institution_name | VARCHAR | Human-readable name (e.g., "Chase") |
| status | VARCHAR | 'active', 'error', or 'expired' |
| error_code | VARCHAR | Set when status = 'error' |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `bank_accounts` — One row per bank account
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| plaid_item_id | UUID | FK → plaid_items.id |
| account_id | VARCHAR | Plaid's unique ID for this account (UNIQUE) |
| name | VARCHAR | Account name (e.g., "Plaid Checking") |
| official_name | VARCHAR | Bank's official name |
| type | VARCHAR | 'depository', 'credit', 'loan', 'investment' |
| subtype | VARCHAR | 'checking', 'savings', 'credit card', etc. |
| mask | VARCHAR | Last 4 digits (e.g., "0000") |
| current_balance | DECIMAL | Latest known balance |
| available_balance | DECIMAL | Available to spend |
| currency_code | VARCHAR | 'USD' |

### `transactions` — One row per transaction
| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary key |
| account_id | UUID | FK → bank_accounts.id |
| transaction_id | VARCHAR | Plaid's unique ID (UNIQUE) |
| amount | DECIMAL | Positive = debit, negative = credit |
| iso_currency_code | VARCHAR | 'USD' |
| date | DATE | Transaction date |
| authorized_date | DATE | When authorization occurred |
| name | VARCHAR | Transaction description |
| merchant_name | VARCHAR | Merchant name if available |
| category | TEXT[] | Array of categories |
| pending | BOOLEAN | True if not yet settled |
| payment_channel | VARCHAR | 'online', 'in store', etc. |

---

## Access Token Encryption

Access tokens are encrypted at the **repository boundary** so the service layer never deals with encryption.

### How it works

```
                      ┌──────────────────────┐
   Plaid gives us     │                      │
   plaintext token ──▶│  PlaidRepository     │
                      │                      │
   createItem():      │  encrypt(token)      │──▶ DB stores: iv:authTag:ciphertext
                      │                      │
   findItems():       │  decrypt(token)      │◀── DB reads:  iv:authTag:ciphertext
                      │                      │
   returns plaintext  │                      │
   to service layer   └──────────────────────┘
```

### Encryption details
- **Algorithm:** AES-256-GCM (authenticated encryption)
- **Key:** 32-byte hex string in `ENCRYPTION_KEY` env var
- **IV:** 16 random bytes per encryption (unique per token)
- **Auth Tag:** 16 bytes — ensures ciphertext hasn't been tampered with
- **Storage format:** `base64(iv):base64(authTag):base64(ciphertext)`
- **File:** `backend/src/utils/crypto.ts`

### Migration
Run `backend/src/db/migrate-encrypt-tokens.ts` to encrypt existing plaintext tokens. It detects already-encrypted tokens by checking for the `iv:authTag:ciphertext` format and skips them.

---

## API Endpoints Summary

All endpoints are under `/api/plaid/` and require JWT auth via `Authorization: Bearer <token>` header.

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/create-link-token` | Get a link_token to initialize Plaid Link |
| POST | `/exchange-token` | Exchange public_token → access_token, store in DB |
| GET | `/accounts` | Get user's accounts from DB |
| GET | `/balances` | Get real-time balances from Plaid API |
| POST | `/sync-transactions` | Pull transactions from Plaid, store in DB |
| GET | `/transactions?limit=N` | Get transactions from DB |

---

## Frontend Data Flow (Dashboard)

```
Dashboard mounts
      │
      ├─── On mount: fetchData() ──────────────┐
      │    parallel: getAccounts + getBalances   │
      │    sets accounts[], balances[] state     │
      │                                          │
      ├─── User clicks "Load Transactions" ─────┤
      │    syncTransactions → getTransactions    │
      │    sets transactions[] state             │
      │                                          │
      ├─── User clicks "Refresh" (balances) ────┤
      │    getBalances → updates balances[]      │
      │                                          │
      └─── User connects bank via PlaidLink ────┤
           exchangePublicToken → fetchData()     │
           auto-refreshes everything             │
```

---

## Sandbox Testing

| Field | Value |
|-------|-------|
| Username | `user_good` |
| Password | `pass_good` |
| Environment | `sandbox` |
| Any test bank works | Chase, Wells Fargo, Bank of America, etc. |

Sandbox returns fake but realistic data: ~20 transactions over the past 90 days, multiple accounts (checking + savings), realistic balances.

---

## File Map

```
Frontend (Next.js)
├── components/PlaidLink.tsx         — Plaid Link button component
├── lib/api-client.ts                — HTTP client for all API calls
├── app/dashboard/page.tsx           — Production financial dashboard
└── app/dashboard/dashboard.module.css

Backend (Fastify)
├── src/routes/plaid.routes.ts       — API route definitions
├── src/services/plaid.service.ts    — Business logic, Plaid API calls
├── src/repositories/plaid.repository.ts — DB queries, encrypt/decrypt boundary
├── src/utils/crypto.ts              — AES-256-GCM encrypt/decrypt
├── src/db/connection.ts             — PostgreSQL pool
├── src/db/migrate-encrypt-tokens.ts — One-time migration script
└── src/types/index.ts               — TypeScript interfaces
```
