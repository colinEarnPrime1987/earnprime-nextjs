import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { AuthService } from '@/services/auth.service'
import { authMiddleware } from '@/middleware/auth.middleware'

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService()

  // Register
  fastify.post('/register', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body)

      const user = await authService.register(body)

      // Generate JWT token
      const token = fastify.jwt.sign({
        userId: user.id,
        email: user.email,
      })

      reply.send({
        success: true,
        data: {
          user,
          token,
        },
        message: 'User registered successfully',
      })
    } catch (error: any) {
      reply.status(400).send({
        success: false,
        error: error.message || 'Registration failed',
      })
    }
  })

  // Login
  fastify.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body)

      const user = await authService.login(body)

      // Generate JWT token
      const token = fastify.jwt.sign({
        userId: user.id,
        email: user.email,
      })

      const { password_hash, ...userWithoutPassword } = user

      reply.send({
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
        message: 'Login successful',
      })
    } catch (error: any) {
      reply.status(401).send({
        success: false,
        error: error.message || 'Login failed',
      })
    }
  })

  // Get current user
  fastify.get(
    '/me',
    { preHandler: [authMiddleware] },
    async (request, reply) => {
      try {
        const userId = request.user!.userId
        const user = await authService.getUserById(userId)

        if (!user) {
          return reply.status(404).send({
            success: false,
            error: 'User not found',
          })
        }

        reply.send({
          success: true,
          data: { user },
        })
      } catch (error: any) {
        reply.status(500).send({
          success: false,
          error: error.message || 'Failed to get user',
        })
      }
    }
  )
}
