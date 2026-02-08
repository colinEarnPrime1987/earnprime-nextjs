// User types
export interface User {
  id: string
  email: string
  password_hash: string
  first_name: string | null
  last_name: string | null
  created_at: Date
  updated_at: Date
}

export interface UserCreate {
  email: string
  password: string
  first_name?: string
  last_name?: string
}

export interface UserLogin {
  email: string
  password: string
}

// Plaid types
export interface PlaidItem {
  id: string
  user_id: string
  item_id: string
  access_token: string
  institution_id: string | null
  institution_name: string | null
  institution_logo: string | null
  institution_primary_color: string | null
  status: 'active' | 'error' | 'expired'
  error_code: string | null
  created_at: Date
  updated_at: Date
}

export interface BankAccount {
  id: string
  plaid_item_id: string
  account_id: string
  name: string
  official_name: string | null
  type: string
  subtype: string | null
  mask: string | null
  current_balance: number | null
  available_balance: number | null
  currency_code: string
  created_at: Date
  updated_at: Date
}

export interface BankAccountWithInstitution extends BankAccount {
  institution_name: string | null
  institution_logo: string | null
  institution_primary_color: string | null
}

export interface Transaction {
  id: string
  account_id: string
  transaction_id: string
  amount: number
  iso_currency_code: string
  date: Date
  authorized_date: Date | null
  name: string
  merchant_name: string | null
  category: string[]
  pending: boolean
  payment_channel: string
  created_at: Date
  updated_at: Date
}

// Note types
export interface Note {
  id: string
  name: string
  description: string | null
  term_months: number
  apy_rate: number
  min_investment: number
  max_capacity: number
  current_invested: number
  risk_rating: 'low' | 'medium' | 'high'
  maturity_date: string
  status: 'active' | 'closed' | 'coming_soon'
  created_at: Date
  updated_at: Date
}

export interface NotePurchase {
  id: string
  user_id: string
  note_id: string
  bank_account_id: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  created_at: Date
  updated_at: Date
}

export interface NotePurchaseWithDetails extends NotePurchase {
  note_name: string
  note_apy_rate: number
  note_term_months: number
  bank_account_name: string
  bank_account_mask: string | null
  institution_name: string | null
}

// JWT Payload
export interface JWTPayload {
  userId: string
  email: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}
