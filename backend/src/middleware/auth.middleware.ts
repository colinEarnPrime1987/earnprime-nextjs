import { FastifyRequest, FastifyReply } from 'fastify'
import { JWTPayload } from '@/types'

declare module 'fastify' {
  interface FastifyRequest {
    user?: JWTPayload
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify()
    request.user = request.user as JWTPayload
  } catch (err) {
    reply.status(401).send({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or missing token',
    })
  }
}

export async function optionalAuth(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    await request.jwtVerify()
    request.user = request.user as JWTPayload
  } catch (err) {
    // If sandbox mode, allow without auth using a consistent test user UUID
    if (process.env.PLAID_ENV === 'sandbox') {
      request.user = {
        userId: '00000000-0000-0000-0000-000000000001',
        email: 'test@example.com',
      }
    }
  }
}
