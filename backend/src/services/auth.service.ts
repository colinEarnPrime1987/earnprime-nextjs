import bcrypt from 'bcrypt'
import { UserRepository } from '@/repositories/user.repository'
import { UserCreate, UserLogin, User } from '@/types'

const SALT_ROUNDS = 10

export class AuthService {
  private userRepo: UserRepository

  constructor() {
    this.userRepo = new UserRepository()
  }

  async register(userData: UserCreate): Promise<Omit<User, 'password_hash'>> {
    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(userData.email)
    if (existingUser) {
      throw new Error('User with this email already exists')
    }

    // Hash password
    const password_hash = await bcrypt.hash(userData.password, SALT_ROUNDS)

    // Create user
    const user = await this.userRepo.create({
      email: userData.email,
      password_hash,
      first_name: userData.first_name,
      last_name: userData.last_name,
    })

    // Remove password_hash from response
    const { password_hash: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }

  async login(credentials: UserLogin): Promise<User> {
    // Find user
    const user = await this.userRepo.findByEmail(credentials.email)
    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      credentials.password,
      user.password_hash
    )
    if (!isValidPassword) {
      throw new Error('Invalid email or password')
    }

    return user
  }

  async getUserById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.userRepo.findById(id)
    if (!user) return null

    const { password_hash: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
}
