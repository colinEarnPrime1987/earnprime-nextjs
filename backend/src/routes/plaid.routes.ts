import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { PlaidService } from '@/services/plaid.service'
import { optionalAuth } from '@/middleware/auth.middleware'
import { JWTPayload } from '@/types'

const exchangeTokenSchema = z.object({
  public_token: z.string(),
})

const syncTransactionsSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
})

export async function plaidRoutes(fastify: FastifyInstance) {
  const plaidService = new PlaidService()

  // Create link token
  fastify.post(
    '/create-link-token',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = (request.user as JWTPayload).userId

        const linkToken = await plaidService.createLinkToken(userId)

        reply.send({
          success: true,
          data: linkToken,
        })
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          error: error.message || 'Failed to create link token',
        })
      }
    }
  )

  // Exchange public token
  fastify.post(
    '/exchange-token',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const body = exchangeTokenSchema.parse(request.body)
        const userId = (request.user as JWTPayload).userId

        const result = await plaidService.exchangePublicToken(
          userId,
          body.public_token
        )

        reply.send({
          success: true,
          data: result,
          message: 'Bank account connected successfully',
        })
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          error: error.message || 'Failed to exchange token',
        })
      }
    }
  )

  // Get accounts
  fastify.get(
    '/accounts',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = (request.user as JWTPayload).userId

        const accounts = await plaidService.getAccounts(userId)

        reply.send({
          success: true,
          data: { accounts },
        })
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          error: error.message || 'Failed to get accounts',
        })
      }
    }
  )

  // Get balances
  fastify.get(
    '/balances',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = (request.user as JWTPayload).userId

        const balances = await plaidService.getBalances(userId)

        reply.send({
          success: true,
          data: { balances },
        })
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          error: error.message || 'Failed to get balances',
        })
      }
    }
  )

  // Sync transactions
  fastify.post(
    '/sync-transactions',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = (request.user as JWTPayload).userId
        const body = syncTransactionsSchema.parse(request.body || {})

        const startDate = body.start_date ? new Date(body.start_date) : undefined
        const endDate = body.end_date ? new Date(body.end_date) : undefined

        const transactions = await plaidService.syncTransactions(
          userId,
          startDate,
          endDate
        )

        reply.send({
          success: true,
          data: {
            transactions,
            count: transactions.length,
          },
          message: 'Transactions synced successfully',
        })
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          error: error.message || 'Failed to sync transactions',
        })
      }
    }
  )

  // Get transactions
  fastify.get(
    '/transactions',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = (request.user as JWTPayload).userId
        const { limit } = request.query as { limit?: string }

        const transactions = await plaidService.getTransactions(
          userId,
          limit ? parseInt(limit) : 100
        )

        reply.send({
          success: true,
          data: {
            transactions,
            count: transactions.length,
          },
        })
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          error: error.message || 'Failed to get transactions',
        })
      }
    }
  )

  // Get institutions
  fastify.get(
    '/institutions',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = (request.user as JWTPayload).userId
        const items = await plaidService.getItems(userId)
        // Strip access_token before returning
        const institutions = items.map(({ access_token, ...rest }) => rest)
        reply.send({
          success: true,
          data: { institutions },
        })
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          error: error.message || 'Failed to get institutions',
        })
      }
    }
  )

  // Get accounts for a specific institution
  fastify.get(
    '/institutions/:itemId/accounts',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = (request.user as JWTPayload).userId
        const { itemId } = request.params as { itemId: string }
        const accounts = await plaidService.getAccountsByItem(userId, itemId)
        reply.send({
          success: true,
          data: { accounts },
        })
      } catch (error: any) {
        const status = error.message === 'Institution not found' ? 404 : 500
        reply.status(status).send({
          success: false,
          error: error.message || 'Failed to get accounts',
        })
      }
    }
  )

  // Get balances for a specific institution
  fastify.get(
    '/institutions/:itemId/balances',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = (request.user as JWTPayload).userId
        const { itemId } = request.params as { itemId: string }
        const balances = await plaidService.getBalancesByItem(userId, itemId)
        reply.send({
          success: true,
          data: { balances },
        })
      } catch (error: any) {
        const status = error.message === 'Institution not found' ? 404 : 500
        reply.status(status).send({
          success: false,
          error: error.message || 'Failed to get balances',
        })
      }
    }
  )

  // Get a specific account detail
  fastify.get(
    '/institutions/:itemId/accounts/:accountId',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = (request.user as JWTPayload).userId
        const { itemId, accountId } = request.params as { itemId: string; accountId: string }
        const account = await plaidService.getAccountDetail(userId, itemId, accountId)
        reply.send({
          success: true,
          data: { account },
        })
      } catch (error: any) {
        const status = ['Institution not found', 'Account not found'].includes(error.message) ? 404 : 500
        reply.status(status).send({
          success: false,
          error: error.message || 'Failed to get account',
        })
      }
    }
  )

  // Get transactions for a specific account
  fastify.get(
    '/institutions/:itemId/accounts/:accountId/transactions',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = (request.user as JWTPayload).userId
        const { itemId, accountId } = request.params as { itemId: string; accountId: string }
        const { limit } = request.query as { limit?: string }
        const transactions = await plaidService.getTransactionsByAccount(
          userId,
          itemId,
          accountId,
          limit ? parseInt(limit) : 100
        )
        reply.send({
          success: true,
          data: {
            transactions,
            count: transactions.length,
          },
        })
      } catch (error: any) {
        const status = ['Institution not found', 'Account not found'].includes(error.message) ? 404 : 500
        reply.status(status).send({
          success: false,
          error: error.message || 'Failed to get transactions',
        })
      }
    }
  )

  // Disconnect (delete) an institution
  fastify.delete(
    '/institutions/:itemId',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = (request.user as JWTPayload).userId
        const { itemId } = request.params as { itemId: string }
        await plaidService.disconnectItem(userId, itemId)
        reply.send({
          success: true,
          message: 'Institution disconnected successfully',
        })
      } catch (error: any) {
        const status = error.message === 'Institution not found' ? 404 : 500
        reply.status(status).send({
          success: false,
          error: error.message || 'Failed to disconnect institution',
        })
      }
    }
  )

  // Get transactions for a specific institution
  fastify.get(
    '/institutions/:itemId/transactions',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      try {
        const userId = (request.user as JWTPayload).userId
        const { itemId } = request.params as { itemId: string }
        const { limit } = request.query as { limit?: string }
        const transactions = await plaidService.getTransactionsByItem(
          userId,
          itemId,
          limit ? parseInt(limit) : 100
        )
        reply.send({
          success: true,
          data: {
            transactions,
            count: transactions.length,
          },
        })
      } catch (error: any) {
        const status = error.message === 'Institution not found' ? 404 : 500
        reply.status(status).send({
          success: false,
          error: error.message || 'Failed to get transactions',
        })
      }
    }
  )
}
