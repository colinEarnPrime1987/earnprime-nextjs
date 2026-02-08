import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { NotesService } from '@/services/notes.service'
import { optionalAuth } from '@/middleware/auth.middleware'

const purchaseSchema = z.object({
  bank_account_id: z.string().uuid(),
  amount: z.number().positive(),
})

export async function notesRoutes(fastify: FastifyInstance) {
  const notesService = new NotesService()

  // Get all notes
  fastify.get(
    '/',
    async (request, reply) => {
      try {
        const notes = await notesService.getAllNotes()
        reply.send({
          success: true,
          data: { notes },
        })
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          error: error.message || 'Failed to get notes',
        })
      }
    }
  )

  // Get user's purchases (registered before /:noteId to avoid route conflict)
  fastify.get(
    '/purchases/me',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = request.user!.userId
        const purchases = await notesService.getUserPurchases(userId)
        reply.send({
          success: true,
          data: { purchases },
        })
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          error: error.message || 'Failed to get purchases',
        })
      }
    }
  )

  // Get note by ID
  fastify.get(
    '/:noteId',
    async (request, reply) => {
      try {
        const { noteId } = request.params as { noteId: string }
        const note = await notesService.getNoteById(noteId)
        reply.send({
          success: true,
          data: { note },
        })
      } catch (error: any) {
        const status = error.message === 'Note not found' ? 404 : 500
        reply.status(status).send({
          success: false,
          error: error.message || 'Failed to get note',
        })
      }
    }
  )

  // Purchase a note
  fastify.post(
    '/:noteId/purchase',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = request.user!.userId
        const { noteId } = request.params as { noteId: string }
        const body = purchaseSchema.parse(request.body)

        const purchase = await notesService.purchaseNote(
          userId,
          noteId,
          body.bank_account_id,
          body.amount
        )

        reply.send({
          success: true,
          data: { purchase },
          message: 'Investment completed successfully',
        })
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          reply.status(400).send({
            success: false,
            error: 'Invalid request data',
          })
          return
        }

        const message = error.message || 'Failed to purchase note'
        const status = [
          'Note not found',
          'Note is not available for investment',
          'Bank account not found',
        ].includes(message) || message.startsWith('Minimum investment') || message.startsWith('Amount exceeds')
          ? 400
          : 500

        reply.status(status).send({
          success: false,
          error: message,
        })
      }
    }
  )
}
