# EarnPrime User Guide

# AES-256-GCM

- AES-256 — 256-bit key, considered unbreakable by brute force. Used by the US government for
  classified data.
- GCM mode — authenticated encryption, meaning it provides both confidentiality (can't read it) and
  integrity (can't tamper with it without detection). The auth tag at line 23 ensures any tampering is
  caught on decrypt.
- Random IV per encryption — each token gets a unique 16-byte initialization vector, so encrypting the
  same token twice produces different ciphertext.

Step-by-step walkthrough for registration, login, connecting bank accounts via Plaid, and purchasing investment notes.

---

## 1. Register a New Account

1. Navigate to the app at `http://localhost:3000`
2. Click **"Sign Up"** or navigate to `/register`
3. Fill in the registration form:
   - **Email** — your email address
   - **Password** — choose a secure password
   - **First Name** (optional)
   - **Last Name** (optional)
4. Click **"Create Account"**
5. On success, the app stores your authentication token and redirects you to the dashboard

**What happens behind the scenes:**

- `POST /api/auth/register` is called
- Your password is hashed with bcrypt and stored in the `users` table
- A JWT token is generated and returned
- The frontend stores the token in `localStorage` for subsequent authenticated requests

---

## 2. Log In to an Existing Account

1. Navigate to `/login`
2. Enter your **email** and **password**
3. Click **"Log In"**
4. On success, you are redirected to the dashboard at `/dashboard`

**What happens behind the scenes:**

- `POST /api/auth/login` is called
- Your password is verified against the stored bcrypt hash
- A JWT token is returned and stored in `localStorage`

---

## 3. Connect a Bank Account (Plaid Integration)

### Prerequisites

- You must be logged in
- The backend must be running on port 3002 with valid Plaid sandbox credentials in `.env`

### Steps

1. On the dashboard, scroll down to the **"Connect a Bank Account"** section
2. Click **"Connect Bank Account"** — this opens the Plaid Link modal
3. In the Plaid Link modal:
   - Select a bank institution (in sandbox mode, use test institutions)
   - Use sandbox credentials:
     - **Username:** `user_good`
     - **Password:** `pass_good`
   - Select which accounts to link
   - Click **"Continue"** / **"Connect"**
4. Plaid Link closes and the dashboard refreshes to show your connected institution and accounts

**What happens behind the scenes:**

1. Frontend calls `POST /api/plaid/create-link-token` to get a Plaid Link token
2. Plaid Link opens in the browser with that token
3. User authenticates with their bank through the Plaid modal
4. Plaid returns a `public_token` to the frontend
5. Frontend calls `POST /api/plaid/exchange-token` with the public token
6. Backend exchanges the public token for a permanent `access_token` via Plaid API
7. Backend fetches institution info and account details from Plaid
8. The access token (encrypted with AES-256-GCM) and account data are stored in the database
9. Dashboard refreshes to display the new institution card with account balances

### Viewing Account Details

1. On the dashboard, click on an **institution card** (e.g., "Chase")
2. This navigates to `/dashboard/institution/[id]`
3. Here you can see:
   - All accounts grouped by type (Bank Accounts, Credit Cards, etc.)
   - Current and available balances for each account
4. Click **"Refresh Balances"** to fetch live balance data from Plaid
5. Click on an individual **account card** to see its transaction history
6. Click **"Disconnect Bank"** to remove the institution and all its data

### Syncing Transactions

1. On the dashboard, click the **"Recent Transactions"** stat card
2. This triggers a transaction sync with Plaid (fetches last 90 days)
3. Transactions appear below the stat cards with date, name, category, and amount
4. Debit amounts show in red, credit amounts show in green

---

## 4. Purchase Investment Notes

### Prerequisites

- You must be logged in
- You must have at least one connected bank account (see step 3 above)
- The notes migration must have been run (`migrate-notes.sql`)

### Browsing Notes

1. On the dashboard, find the **"Invest"** section
2. Click the **"Notes Marketplace"** card — this navigates to `/dashboard/notes`
3. The notes board shows:
   - **Stats row:** Active Notes count, Highest APY, Total Available capacity
   - **Notes grid:** All available investment notes as cards
4. Each note card displays:
   - Note name and status badge (green = Active, amber = Coming Soon, gray = Closed)
   - APY rate in large green text
   - Term length, minimum investment, and risk level
   - Maturity date
   - Progress bar showing how much capacity has been filled
5. Only **Active** notes are clickable; Coming Soon and Closed notes are grayed out

### Purchasing a Note

1. Click on an **Active** note card to navigate to `/dashboard/notes/[id]`
2. The detail page shows:
   - APY Rate, Term, and Maturity Date stats
   - Full description of the note
   - Risk rating badge
   - Availability progress bar with remaining capacity
   - **Purchase form** (only visible for active notes)
3. Fill in the purchase form:
   - **Investment Amount** — enter a dollar amount
     - Must be at least the minimum investment shown
     - Cannot exceed the remaining capacity
   - **Fund From** — select a bank account from the dropdown
     - Shows all your connected bank accounts as `{Institution} - {Account Name} ····{last 4 digits}`
4. Click **"Confirm Purchase"**
5. On success:
   - A green **"Investment Confirmed"** card appears showing your invested amount
   - The availability progress bar updates to reflect the new capacity
   - The purchase form is hidden (you've already invested)

**What happens behind the scenes:**

1. Frontend calls `POST /api/notes/:noteId/purchase` with `bank_account_id` and `amount`
2. Backend validates:
   - The note exists and has `active` status
   - The amount meets the minimum investment requirement
   - The amount doesn't exceed remaining capacity
   - The bank account belongs to the authenticated user
3. A database transaction atomically:
   - Updates `notes.current_invested` by adding the purchase amount (with a capacity check)
   - Inserts a row into `note_purchases` with status `completed`
4. The purchase record is returned to the frontend

### Viewing Your Purchases

Your purchase history is available via the API endpoint `GET /api/notes/purchases/me`. This returns all your note purchases with details including the note name, APY rate, term, bank account used, and purchase amount.

---

## Environment Setup Quick Reference

### Required Environment Variables (`.env`)

```
# Database
DB_HOST=<aurora-endpoint>
DB_PORT=5432
DB_NAME=earnprime
DB_USER=<username>
DB_PASSWORD=<password>

# JWT
JWT_SECRET=<your-secret>

# Plaid (Sandbox)
PLAID_CLIENT_ID=<client-id>
PLAID_SANDBOX_SECRET=<sandbox-secret>
PLAID_ENV=sandbox

# Encryption
ENCRYPTION_KEY=<64-char-hex-key>

# Frontend
FRONTEND_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Running the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev        # Starts Fastify on port 3002

# Terminal 2 — Frontend
npm run dev        # Starts Next.js on port 3000
```

### Running Database Migrations

```bash
# Initial schema
psql <connection_string> -f backend/src/db/schema.sql

# Notes marketplace tables + seed data
psql <connection_string> -f backend/src/db/migrate-notes.sql
```
