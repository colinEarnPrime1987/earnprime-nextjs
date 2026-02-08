import { Configuration, PlaidApi, PlaidEnvironments, Products, CountryCode } from 'plaid'
import { PlaidRepository } from '@/repositories/plaid.repository'

let plaidClient: PlaidApi | null = null

function getPlaidClient(): PlaidApi {
  if (!plaidClient) {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
          'PLAID-SECRET': process.env.PLAID_SANDBOX_SECRET!,
        },
      },
    })
    plaidClient = new PlaidApi(configuration)
  }
  return plaidClient
}

export class PlaidService {
  private plaidRepo: PlaidRepository

  constructor() {
    this.plaidRepo = new PlaidRepository()
  }

  async createLinkToken(userId: string): Promise<{ link_token: string; expiration: string }> {
    try {
      const response = await getPlaidClient().linkTokenCreate({
        user: {
          client_user_id: userId,
        },
        client_name: 'EarnPrime',
        products: [Products.Auth, Products.Transactions],
        country_codes: [CountryCode.Us],
        language: 'en',
      })
      return {
        link_token: response.data.link_token,
        expiration: response.data.expiration,
      }
    } catch (error) {
      console.error('Error creating link token:', error)
      throw new Error('Failed to create link token')
    }
  }

  async exchangePublicToken(userId: string, publicToken: string) {
    try {
      // Exchange public token for access token
      const tokenResponse = await getPlaidClient().itemPublicTokenExchange({
        public_token: publicToken,
      })

      const accessToken = tokenResponse.data.access_token
      const itemId = tokenResponse.data.item_id

      // Get institution info
      const itemResponse = await getPlaidClient().itemGet({
        access_token: accessToken,
      })

      const institutionId = itemResponse.data.item.institution_id || undefined

      let institutionName: string | undefined
      let institutionLogo: string | undefined
      let institutionPrimaryColor: string | undefined
      if (institutionId) {
        const instResponse = await getPlaidClient().institutionsGetById({
          institution_id: institutionId,
          country_codes: [CountryCode.Us],
          options: { include_optional_metadata: true },
        })
        institutionName = instResponse.data.institution.name
        institutionLogo = instResponse.data.institution.logo || undefined
        institutionPrimaryColor = instResponse.data.institution.primary_color || undefined
      }

      // Store item in database
      const plaidItem = await this.plaidRepo.createItem({
        user_id: userId,
        item_id: itemId,
        access_token: accessToken,
        institution_id: institutionId,
        institution_name: institutionName,
        institution_logo: institutionLogo,
        institution_primary_color: institutionPrimaryColor,
      })

      // Get accounts
      const accountsResponse = await getPlaidClient().accountsGet({
        access_token: accessToken,
      })

      // Store accounts in database
      for (const account of accountsResponse.data.accounts) {
        await this.plaidRepo.createAccount({
          plaid_item_id: plaidItem.id,
          account_id: account.account_id,
          name: account.name,
          official_name: account.official_name || undefined,
          type: account.type,
          subtype: account.subtype || undefined,
          mask: account.mask || undefined,
          current_balance: account.balances.current || undefined,
          available_balance: account.balances.available || undefined,
          currency_code: account.balances.iso_currency_code || 'USD',
        })
      }

      return {
        item_id: itemId,
        institution_name: institutionName,
        accounts: accountsResponse.data.accounts.map((acc) => ({
          id: acc.account_id,
          name: acc.name,
          type: acc.type,
          subtype: acc.subtype,
          mask: acc.mask,
        })),
      }
    } catch (error) {
      console.error('Error exchanging public token:', error)
      throw new Error('Failed to exchange public token')
    }
  }

  async getAccounts(userId: string) {
    return await this.plaidRepo.findAccountsByUserId(userId)
  }

  async getBalances(userId: string) {
    const items = await this.plaidRepo.findItemsByUserId(userId)
    const allBalances = []

    for (const item of items) {
      try {
        const response = await getPlaidClient().accountsBalanceGet({
          access_token: item.access_token,
        })

        // Update balances in database
        for (const account of response.data.accounts) {
          await this.plaidRepo.updateAccountBalances(
            account.account_id,
            account.balances.current || 0,
            account.balances.available || 0
          )

          allBalances.push({
            account_id: account.account_id,
            name: account.name,
            type: account.type,
            subtype: account.subtype,
            mask: account.mask,
            current_balance: account.balances.current,
            available_balance: account.balances.available,
            currency_code: account.balances.iso_currency_code,
          })
        }
      } catch (error) {
        console.error(`Error fetching balances for item ${item.item_id}:`, error)
        await this.plaidRepo.updateItemStatus(item.item_id, 'error', 'BALANCE_FETCH_ERROR')
      }
    }

    return allBalances
  }

  async syncTransactions(userId: string, startDate?: Date, endDate?: Date) {
    const items = await this.plaidRepo.findItemsByUserId(userId)
    const allTransactions = []

    const start = startDate || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // 90 days ago
    const end = endDate || new Date()

    for (const item of items) {
      try {
        const response = await getPlaidClient().transactionsGet({
          access_token: item.access_token,
          start_date: start.toISOString().split('T')[0],
          end_date: end.toISOString().split('T')[0],
          options: {
            count: 500,
            offset: 0,
          },
        })

        // Store transactions in database
        for (const transaction of response.data.transactions) {
          const storedTransaction = await this.plaidRepo.createTransaction({
            account_id: transaction.account_id,
            transaction_id: transaction.transaction_id,
            amount: transaction.amount,
            iso_currency_code: transaction.iso_currency_code || 'USD',
            date: new Date(transaction.date),
            authorized_date: transaction.authorized_date
              ? new Date(transaction.authorized_date)
              : undefined,
            name: transaction.name,
            merchant_name: transaction.merchant_name || undefined,
            category: transaction.category || [],
            pending: transaction.pending,
            payment_channel: transaction.payment_channel,
          })

          allTransactions.push(storedTransaction)
        }
      } catch (error) {
        console.error(`Error syncing transactions for item ${item.item_id}:`, error)
        await this.plaidRepo.updateItemStatus(item.item_id, 'error', 'TRANSACTION_SYNC_ERROR')
      }
    }

    return allTransactions
  }

  async getTransactions(userId: string, limit: number = 100) {
    return await this.plaidRepo.findTransactionsByUserId(userId, limit)
  }

  // Per-institution methods
  async getItems(userId: string) {
    return await this.plaidRepo.findItemsByUserId(userId)
  }

  async getAccountsByItem(userId: string, itemId: string) {
    const item = await this.plaidRepo.findItemByIdAndUserId(itemId, userId)
    if (!item) throw new Error('Institution not found')
    return await this.plaidRepo.findAccountsByItemId(itemId)
  }

  async getTransactionsByItem(userId: string, itemId: string, limit: number = 100) {
    const item = await this.plaidRepo.findItemByIdAndUserId(itemId, userId)
    if (!item) throw new Error('Institution not found')
    return await this.plaidRepo.findTransactionsByItemId(itemId, limit)
  }

  async getAccountDetail(userId: string, itemId: string, accountUuid: string) {
    const item = await this.plaidRepo.findItemByIdAndUserId(itemId, userId)
    if (!item) throw new Error('Institution not found')
    const account = await this.plaidRepo.findAccountByUuidAndItemId(accountUuid, itemId)
    if (!account) throw new Error('Account not found')
    return account
  }

  async getTransactionsByAccount(userId: string, itemId: string, accountUuid: string, limit: number = 100) {
    const item = await this.plaidRepo.findItemByIdAndUserId(itemId, userId)
    if (!item) throw new Error('Institution not found')
    const account = await this.plaidRepo.findAccountByUuidAndItemId(accountUuid, itemId)
    if (!account) throw new Error('Account not found')
    return await this.plaidRepo.findTransactionsByAccountUuid(accountUuid, limit)
  }

  async disconnectItem(userId: string, itemId: string) {
    const item = await this.plaidRepo.findItemByIdAndUserId(itemId, userId)
    if (!item) throw new Error('Institution not found')

    // Best-effort: tell Plaid to revoke the connection
    try {
      await getPlaidClient().itemRemove({ access_token: item.access_token })
    } catch (error) {
      console.error(`Plaid itemRemove failed for item ${item.item_id} (continuing):`, error)
    }

    await this.plaidRepo.deleteItem(itemId)
  }

  async getBalancesByItem(userId: string, itemId: string) {
    const item = await this.plaidRepo.findItemByIdAndUserId(itemId, userId)
    if (!item) throw new Error('Institution not found')

    try {
      const response = await getPlaidClient().accountsBalanceGet({
        access_token: item.access_token,
      })

      const balances = []
      for (const account of response.data.accounts) {
        await this.plaidRepo.updateAccountBalances(
          account.account_id,
          account.balances.current || 0,
          account.balances.available || 0
        )
        balances.push({
          account_id: account.account_id,
          name: account.name,
          type: account.type,
          subtype: account.subtype,
          mask: account.mask,
          current_balance: account.balances.current,
          available_balance: account.balances.available,
          currency_code: account.balances.iso_currency_code,
        })
      }
      return balances
    } catch (error) {
      console.error(`Error fetching balances for item ${item.item_id}:`, error)
      await this.plaidRepo.updateItemStatus(item.item_id, 'error', 'BALANCE_FETCH_ERROR')
      throw new Error('Failed to fetch balances for this institution')
    }
  }
}
