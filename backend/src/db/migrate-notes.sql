-- Notes Marketplace Tables
-- Run: psql <connection_string> -f backend/src/db/migrate-notes.sql

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  term_months INTEGER NOT NULL,
  apy_rate DECIMAL(5,2) NOT NULL,
  min_investment DECIMAL(12,2) NOT NULL,
  max_capacity DECIMAL(12,2) NOT NULL,
  current_invested DECIMAL(12,2) NOT NULL DEFAULT 0,
  risk_rating VARCHAR(20) NOT NULL CHECK (risk_rating IN ('low', 'medium', 'high')),
  maturity_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'closed', 'coming_soon')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notes_status ON notes(status);

-- Note purchases table
CREATE TABLE IF NOT EXISTS note_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note_id UUID NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  bank_account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_note_purchases_user_id ON note_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_note_purchases_note_id ON note_purchases(note_id);

-- Triggers (reuses existing update_updated_at_column function from schema.sql)
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_note_purchases_updated_at
  BEFORE UPDATE ON note_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Seed data
INSERT INTO notes (name, description, term_months, apy_rate, min_investment, max_capacity, current_invested, risk_rating, maturity_date, status) VALUES
(
  'EarnPrime Short-Term Note I',
  'A low-risk, short-term investment note backed by a diversified portfolio of high-grade corporate bonds. Ideal for conservative investors seeking stable returns with capital preservation.',
  3,
  4.25,
  500.00,
  500000.00,
  187500.00,
  'low',
  '2026-06-01',
  'active'
),
(
  'EarnPrime Growth Note II',
  'A medium-risk note offering higher yields through exposure to a balanced mix of investment-grade and high-yield fixed income securities. Suitable for investors comfortable with moderate risk.',
  6,
  6.50,
  1000.00,
  750000.00,
  412000.00,
  'medium',
  '2026-09-01',
  'active'
),
(
  'EarnPrime High-Yield Note III',
  'A higher-risk note targeting premium returns through strategic allocation in emerging market debt and structured credit products. Designed for experienced investors with higher risk tolerance.',
  12,
  9.75,
  2500.00,
  1000000.00,
  890000.00,
  'high',
  '2027-02-01',
  'active'
),
(
  'EarnPrime Flex Note IV',
  'An upcoming flexible-term note with competitive rates and weekly liquidity windows. Details will be finalized before launch.',
  6,
  5.80,
  750.00,
  600000.00,
  0.00,
  'medium',
  '2026-12-01',
  'coming_soon'
),
(
  'EarnPrime Starter Note Q4-2025',
  'This note has reached full capacity and is no longer accepting new investments. Existing investors will continue to earn the stated APY through maturity.',
  3,
  3.90,
  250.00,
  300000.00,
  300000.00,
  'low',
  '2026-03-15',
  'closed'
);
