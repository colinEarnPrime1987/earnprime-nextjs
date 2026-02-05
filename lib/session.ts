// In-memory session storage (for development/prototype)
// In production, use Redis or a database

interface Session {
  userId: string
  username: string
  createdAt: Date
  expiresAt: Date
}

interface User {
  id: string
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  // Full user data would be stored here
}

// Mock user database (in-memory)
const users: Map<string, User> = new Map()

// Mock sessions (in-memory)
const sessions: Map<string, Session> = new Map()

// Session duration (24 hours)
const SESSION_DURATION = 24 * 60 * 60 * 1000

/**
 * Create a new session for a user
 */
export function createSession(userId: string, username: string): string {
  const sessionId = generateSessionId()
  const session: Session = {
    userId,
    username,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + SESSION_DURATION),
  }

  sessions.set(sessionId, session)
  return sessionId
}

/**
 * Get session data
 */
export function getSession(sessionId: string): Session | null {
  const session = sessions.get(sessionId)

  if (!session) return null

  // Check if expired
  if (new Date() > session.expiresAt) {
    sessions.delete(sessionId)
    return null
  }

  return session
}

/**
 * Destroy a session
 */
export function destroySession(sessionId: string): void {
  sessions.delete(sessionId)
}

/**
 * Create a new user (mock database)
 */
export function createUser(userData: Omit<User, 'id'>): User {
  const id = generateUserId()
  const user: User = {
    id,
    ...userData,
  }

  users.set(id, user)
  return user
}

/**
 * Find user by username or email
 */
export function findUserByUsername(username: string): User | null {
  for (const user of users.values()) {
    if (user.username === username || user.email === username) {
      return user
    }
  }
  return null
}

/**
 * Find user by ID
 */
export function findUserById(id: string): User | null {
  return users.get(id) || null
}

/**
 * Validate password (mock - in production use bcrypt)
 */
export function validatePassword(plainPassword: string, hashedPassword: string): boolean {
  // Mock validation - in production, use bcrypt.compare()
  return plainPassword === hashedPassword
}

/**
 * Hash password (mock - in production use bcrypt)
 */
export function hashPassword(password: string): string {
  // Mock hashing - in production, use bcrypt.hash()
  return password
}

/**
 * Generate a random session ID
 */
function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Generate a random user ID
 */
function generateUserId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Initialize with a demo user for testing
 */
export function initializeDemoUser(): void {
  const demoUser: Omit<User, 'id'> = {
    username: 'demo',
    email: 'demo@earnprime.org',
    password: 'password123', // In production, this would be hashed
    firstName: 'Demo',
    lastName: 'User',
  }

  if (!findUserByUsername('demo')) {
    createUser(demoUser)
    console.log('✓ Demo user created: username="demo", password="password123"')
  }
}
