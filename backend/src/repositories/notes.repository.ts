import { query, getClient } from '@/db/connection'
import { Note, NotePurchase, NotePurchaseWithDetails } from '@/types'

export class NotesRepository {
  async findAllNotes(): Promise<Note[]> {
    return await query<Note>(
      `SELECT * FROM notes
       ORDER BY status ASC, apy_rate DESC`
    )
  }

  async findNoteById(id: string): Promise<Note | null> {
    const notes = await query<Note>(
      'SELECT * FROM notes WHERE id = $1',
      [id]
    )
    return notes[0] || null
  }

  async createPurchase(data: {
    user_id: string
    note_id: string
    bank_account_id: string
    amount: number
  }): Promise<NotePurchase> {
    const client = await getClient()
    try {
      await client.query('BEGIN')

      // Atomically update current_invested, checking capacity
      const updateResult = await client.query(
        `UPDATE notes
         SET current_invested = current_invested + $1
         WHERE id = $2
           AND current_invested + $1 <= max_capacity
         RETURNING *`,
        [data.amount, data.note_id]
      )

      if (updateResult.rows.length === 0) {
        throw new Error('Insufficient capacity or note not found')
      }

      const purchaseResult = await client.query(
        `INSERT INTO note_purchases (user_id, note_id, bank_account_id, amount, status)
         VALUES ($1, $2, $3, $4, 'completed')
         RETURNING *`,
        [data.user_id, data.note_id, data.bank_account_id, data.amount]
      )

      await client.query('COMMIT')
      return purchaseResult.rows[0]
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  async findPurchasesByUserId(user_id: string): Promise<NotePurchaseWithDetails[]> {
    return await query<NotePurchaseWithDetails>(
      `SELECT np.*,
              n.name AS note_name,
              n.apy_rate AS note_apy_rate,
              n.term_months AS note_term_months,
              ba.name AS bank_account_name,
              ba.mask AS bank_account_mask,
              pi.institution_name
       FROM note_purchases np
       JOIN notes n ON np.note_id = n.id
       JOIN bank_accounts ba ON np.bank_account_id = ba.id
       JOIN plaid_items pi ON ba.plaid_item_id = pi.id
       WHERE np.user_id = $1
       ORDER BY np.created_at DESC`,
      [user_id]
    )
  }
}
