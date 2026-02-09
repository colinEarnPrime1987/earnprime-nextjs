const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl

    // Load token from localStorage if available (client-side only)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token)
      } else {
        localStorage.removeItem('auth_token')
      }
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers as Record<string, string>,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred')
    }

    return data
  }

  // Auth endpoints
  async register(email: string, password: string, firstName?: string, lastName?: string) {
    const response = await this.request<{ user: any; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, first_name: firstName, last_name: lastName }),
    })

    if (response.data?.token) {
      this.setToken(response.data.token)
    }

    return response
  }

  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (response.data?.token) {
      this.setToken(response.data.token)
    }

    return response
  }

  async getCurrentUser() {
    return await this.request<{ user: any }>('/api/auth/me')
  }

  logout() {
    this.setToken(null)
  }

  // Plaid endpoints
  async createLinkToken() {
    return await this.request<{ link_token: string; expiration: string }>(
      '/api/plaid/create-link-token',
      { method: 'POST' }
    )
  }

  async exchangePublicToken(publicToken: string) {
    return await this.request<any>('/api/plaid/exchange-token', {
      method: 'POST',
      body: JSON.stringify({ public_token: publicToken }),
    })
  }

  async getAccounts() {
    return await this.request<{ accounts: any[] }>('/api/plaid/accounts')
  }

  async getBalances() {
    return await this.request<{ balances: any[] }>('/api/plaid/balances')
  }

  async syncTransactions(startDate?: string, endDate?: string) {
    return await this.request<{ transactions: any[]; count: number }>(
      '/api/plaid/sync-transactions',
      {
        method: 'POST',
        body: JSON.stringify({ start_date: startDate, end_date: endDate }),
      }
    )
  }

  async getTransactions(limit: number = 100) {
    return await this.request<{ transactions: any[]; count: number }>(
      `/api/plaid/transactions?limit=${limit}`
    )
  }

  // Institution-scoped endpoints
  async getInstitutions() {
    return await this.request<{ institutions: any[] }>('/api/plaid/institutions')
  }

  async getInstitutionAccounts(itemId: string) {
    return await this.request<{ accounts: any[] }>(
      `/api/plaid/institutions/${itemId}/accounts`
    )
  }

  async getInstitutionBalances(itemId: string) {
    return await this.request<{ balances: any[] }>(
      `/api/plaid/institutions/${itemId}/balances`
    )
  }

  async getAccountDetail(itemId: string, accountId: string) {
    return await this.request<{ account: any }>(
      `/api/plaid/institutions/${itemId}/accounts/${accountId}`
    )
  }

  async getAccountTransactions(itemId: string, accountId: string, limit: number = 100) {
    return await this.request<{ transactions: any[]; count: number }>(
      `/api/plaid/institutions/${itemId}/accounts/${accountId}/transactions?limit=${limit}`
    )
  }

  async disconnectInstitution(itemId: string) {
    return await this.request(`/api/plaid/institutions/${itemId}`, {
      method: 'DELETE',
    })
  }

  async getInstitutionTransactions(itemId: string, limit: number = 100) {
    return await this.request<{ transactions: any[]; count: number }>(
      `/api/plaid/institutions/${itemId}/transactions?limit=${limit}`
    )
  }

  // Notes endpoints
  async getNotes() {
    return await this.request<{ notes: any[] }>('/api/notes')
  }

  async getNote(noteId: string) {
    return await this.request<{ note: any }>(`/api/notes/${noteId}`)
  }

  async purchaseNote(noteId: string, bankAccountId: string, amount: number) {
    return await this.request<{ purchase: any }>(`/api/notes/${noteId}/purchase`, {
      method: 'POST',
      body: JSON.stringify({ bank_account_id: bankAccountId, amount }),
    })
  }

  async getMyPurchases() {
    return await this.request<{ purchases: any[] }>('/api/notes/purchases/me')
  }
}

export const apiClient = new ApiClient(API_URL)
