import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import dotenv from 'dotenv'
import { getPool } from '@/db/connection'
import { authRoutes } from '@/routes/auth.routes'
import { plaidRoutes } from '@/routes/plaid.routes'
import { notesRoutes } from '@/routes/notes.routes'

// Load environment variables
dotenv.config()

// Create Fastify instance
const fastify = Fastify({
  logger: process.env.NODE_ENV === 'development',
})

// Register CORS
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'
fastify.register(cors, {
  origin: [frontendUrl, frontendUrl.replace('://', '://www.')],
  credentials: true,
})

// Register JWT
fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
})

// Health check route
fastify.get('/health', async (request, reply) => {
  try {
    const pool = getPool()
    await pool.query('SELECT 1')

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
    }
  } catch (error) {
    reply.status(503).send({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    })
  }
})

// Register routes
fastify.register(authRoutes, { prefix: '/api/auth' })
fastify.register(plaidRoutes, { prefix: '/api/plaid' })
fastify.register(notesRoutes, { prefix: '/api/notes' })

// Error handler
fastify.setErrorHandler((error: Error & { statusCode?: number }, request, reply) => {
  fastify.log.error(error)

  const statusCode = error.statusCode || 500

  reply.status(statusCode).send({
    success: false,
    error: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  })
})

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3002')
    const host = process.env.HOST || '0.0.0.0'

    // Test database connection
    const pool = getPool()
    await pool.query('SELECT 1')
    fastify.log.info('✓ Database connected successfully')

    await fastify.listen({ port, host })

    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🚀 EarnPrime Backend Server                         ║
║                                                        ║
║   Server:    http://localhost:${port}                   ║
║   Health:    http://localhost:${port}/health           ║
║   API:       http://localhost:${port}/api              ║
║                                                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                              ║
║   Database:    Connected ✓                            ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
    `)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  console.log('\n\nShutting down gracefully...')
  await fastify.close()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n\nShutting down gracefully...')
  await fastify.close()
  process.exit(0)
})

start()
