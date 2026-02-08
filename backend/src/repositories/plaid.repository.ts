import { query } from '@/db/connection'
import { PlaidItem, BankAccount, BankAccountWithInstitution, Transaction } from '@/types'
import { encrypt, decrypt } from '@/utils/crypto'

export class PlaidRepository {
  // Plaid Items
  async createItem(data: {
    user_id: string
    item_id: string
    access_token: string
    institution_id?: string
    institution_name?: string
    institution_logo?: string
    institution_primary_color?: string
  }): Promise<PlaidItem> {
    const encryptedToken = encrypt(data.access_token)
    const items = await query<PlaidItem>(
      `INSERT INTO plaid_items (user_id, item_id, access_token, institution_id, institution_name, institution_logo, institution_primary_color, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'active')
       RETURNING *`,
      [
        data.user_id,
        data.item_id,
        encryptedToken,
        data.institution_id || null,
        data.institution_name || null,
        data.institution_logo || null,
        data.institution_primary_color || null,
      ]
    )
    const item = items[0]
    item.access_token = decrypt(item.access_token)
    return item
  }

  async findItemByItemId(item_id: string): Promise<PlaidItem | null> {
    const items = await query<PlaidItem>(
      'SELECT * FROM plaid_items WHERE item_id = $1',
      [item_id]
    )
    if (!items[0]) return null
    items[0].access_token = decrypt(items[0].access_token)
    return items[0]
  }

  async findItemsByUserId(user_id: string): Promise<PlaidItem[]> {
    const items = await query<PlaidItem>(
      'SELECT * FROM plaid_items WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    )
    for (const item of items) {
      item.access_token = decrypt(item.access_token)
    }
    return items
  }

  async updateItemStatus(
    item_id: string,
    status: string,
    error_code?: string
  ): Promise<void> {
    await query(
      'UPDATE plaid_items SET status = $1, error_code = $2 WHERE item_id = $3',
      [status, error_code || null, item_id]
    )
  }

  // Bank Accounts
  async createAccount(data: {
    plaid_item_id: string
    account_id: string
    name: string
    official_name?: string
    type: string
    subtype?: string
    mask?: string
    current_balance?: number
    available_balance?: number
    currency_code: string
  }): Promise<BankAccount> {
    const accounts = await query<BankAccount>(
      `INSERT INTO bank_accounts
       (plaid_item_id, account_id, name, official_name, type, subtype, mask,
        current_balance, available_balance, currency_code)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (account_id)
       DO UPDATE SET
         name = EXCLUDED.name,
         official_name = EXCLUDED.official_name,
         type = EXCLUDED.type,
         subtype = EXCLUDED.subtype,
         mask = EXCLUDED.mask,
         current_balance = EXCLUDED.current_balance,
         available_balance = EXCLUDED.available_balance,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        data.plaid_item_id,
        data.account_id,
        data.name,
        data.official_name || null,
        data.type,
        data.subtype || null,
        data.mask || null,
        data.current_balance || null,
        data.available_balance || null,
        data.currency_code,
      ]
    )
    return accounts[0]
  }

  async findAccountsByUserId(user_id: string): Promise<BankAccountWithInstitution[]> {
    return await query<BankAccountWithInstitution>(
      `SELECT ba.*, pi.institution_name, pi.institution_logo, pi.institution_primary_color
       FROM bank_accounts ba
       JOIN plaid_items pi ON ba.plaid_item_id = pi.id
       WHERE pi.user_id = $1
       ORDER BY ba.type ASC, ba.created_at DESC`,
      [user_id]
    )
  }

  async findAccountById(account_id: string): Promise<BankAccount | null> {
    const accounts = await query<BankAccount>(
      'SELECT * FROM bank_accounts WHERE account_id = $1',
      [account_id]
    )
    return accounts[0] || null
  }

  async updateAccountBalances(
    account_id: string,
    current_balance: number,
    available_balance: number
  ): Promise<void> {
    await query(
      `UPDATE bank_accounts
       SET current_balance = $1, available_balance = $2, updated_at = CURRENT_TIMESTAMP
       WHERE account_id = $3`,
      [current_balance, available_balance, account_id]
    )
  }

  // Transactions
  async createTransaction(data: {
    account_id: string
    transaction_id: string
    amount: number
    iso_currency_code: string
    date: Date
    authorized_date?: Date
    name: string
    merchant_name?: string
    category: string[]
    pending: boolean
    payment_channel: string
  }): Promise<Transaction> {
    // First get the bank account UUID from account_id
    const account = await this.findAccountById(data.account_id)
    if (!account) {
      throw new Error(`Account not found: ${data.account_id}`)
    }

    const transactions = await query<Transaction>(
      `INSERT INTO transactions
       (account_id, transaction_id, amount, iso_currency_code, date, authorized_date,
        name, merchant_name, category, pending, payment_channel)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (transaction_id)
       DO UPDATE SET
         amount = EXCLUDED.amount,
         pending = EXCLUDED.pending,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [
        account.id, // Use the UUID from bank_accounts table
        data.transaction_id,
        data.amount,
        data.iso_currency_code,
        data.date,
        data.authorized_date || null,
        data.name,
        data.merchant_name || null,
        data.category,
        data.pending,
        data.payment_channel,
      ]
    )
    return transactions[0]
  }

  async findTransactionsByAccountId(account_id: string): Promise<Transaction[]> {
    return await query<Transaction>(
      'SELECT * FROM transactions WHERE account_id = $1 ORDER BY date DESC LIMIT 100',
      [account_id]
    )
  }

  async findTransactionsByUserId(
    user_id: string,
    limit: number = 100
  ): Promise<Transaction[]> {
    return await query<Transaction>(
      `SELECT t.* FROM transactions t
       JOIN bank_accounts ba ON t.account_id = ba.id
       JOIN plaid_items pi ON ba.plaid_item_id = pi.id
       WHERE pi.user_id = $1
       ORDER BY t.date DESC
       LIMIT $2`,
      [user_id, limit]
    )
  }

  // Per-institution queries
  async findItemByIdAndUserId(id: string, user_id: string): Promise<PlaidItem | null> {
    const items = await query<PlaidItem>(
      'SELECT * FROM plaid_items WHERE id = $1 AND user_id = $2',
      [id, user_id]
    )
    if (!items[0]) return null
    items[0].access_token = decrypt(items[0].access_token)
    return items[0]
  }

  async findAccountsByItemId(item_id: string): Promise<BankAccountWithInstitution[]> {
    return await query<BankAccountWithInstitution>(
      `SELECT ba.*, pi.institution_name, pi.institution_logo, pi.institution_primary_color
       FROM bank_accounts ba
       JOIN plaid_items pi ON ba.plaid_item_id = pi.id
       WHERE ba.plaid_item_id = $1
       ORDER BY ba.type ASC, ba.created_at DESC`,
      [item_id]
    )
  }

  async findAccountByUuidAndItemId(uuid: string, item_id: string): Promise<BankAccountWithInstitution | null> {
    const accounts = await query<BankAccountWithInstitution>(
      `SELECT ba.*, pi.institution_name, pi.institution_logo, pi.institution_primary_color
       FROM bank_accounts ba
       JOIN plaid_items pi ON ba.plaid_item_id = pi.id
       WHERE ba.id = $1 AND ba.plaid_item_id = $2`,
      [uuid, item_id]
    )
    return accounts[0] || null
  }

  async findTransactionsByAccountUuid(account_uuid: string, limit: number = 100): Promise<Transaction[]> {
    return await query<Transaction>(
      'SELECT * FROM transactions WHERE account_id = $1 ORDER BY date DESC LIMIT $2',
      [account_uuid, limit]
    )
  }

  async findTransactionsByItemId(item_id: string, limit: number = 100): Promise<Transaction[]> {
    return await query<Transaction>(
      `SELECT t.* FROM transactions t
       JOIN bank_accounts ba ON t.account_id = ba.id
       WHERE ba.plaid_item_id = $1
       ORDER BY t.date DESC
       LIMIT $2`,
      [item_id, limit]
    )
  }

  async deleteItem(id: string): Promise<void> {
    await query('DELETE FROM plaid_items WHERE id = $1', [id])
  }
}
