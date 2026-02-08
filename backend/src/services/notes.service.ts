import { NotesRepository } from '@/repositories/notes.repository'
import { PlaidRepository } from '@/repositories/plaid.repository'

export class NotesService {
  private notesRepo: NotesRepository
  private plaidRepo: PlaidRepository

  constructor() {
    this.notesRepo = new NotesRepository()
    this.plaidRepo = new PlaidRepository()
  }

  async getAllNotes() {
    return await this.notesRepo.findAllNotes()
  }

  async getNoteById(noteId: string) {
    const note = await this.notesRepo.findNoteById(noteId)
    if (!note) throw new Error('Note not found')
    return note
  }

  async purchaseNote(userId: string, noteId: string, bankAccountId: string, amount: number) {
    // Validate note exists and is active
    const note = await this.notesRepo.findNoteById(noteId)
    if (!note) throw new Error('Note not found')
    if (note.status !== 'active') throw new Error('Note is not available for investment')

    // Validate amount
    if (amount < Number(note.min_investment)) {
      throw new Error(`Minimum investment is $${note.min_investment}`)
    }

    const remaining = Number(note.max_capacity) - Number(note.current_invested)
    if (amount > remaining) {
      throw new Error(`Amount exceeds remaining capacity of $${remaining.toFixed(2)}`)
    }

    // Validate bank account belongs to user
    const userAccounts = await this.plaidRepo.findAccountsByUserId(userId)
    const bankAccount = userAccounts.find((a) => a.id === bankAccountId)
    if (!bankAccount) throw new Error('Bank account not found')

    return await this.notesRepo.createPurchase({
      user_id: userId,
      note_id: noteId,
      bank_account_id: bankAccountId,
      amount,
    })
  }

  async getUserPurchases(userId: string) {
    return await this.notesRepo.findPurchasesByUserId(userId)
  }
}
