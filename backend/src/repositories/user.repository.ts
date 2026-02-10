import { query } from '@/db/connection'
import { User, UserCreate } from '@/types'

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const users = await query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return users[0] || null
  }

  async findById(id: string): Promise<User | null> {
    const users = await query<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    return users[0] || null
  }

  async create(userData: Omit<UserCreate, 'password'> & { password_hash: string }): Promise<User> {
    const users = await query<User>(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [
        userData.email,
        userData.password_hash,
        userData.first_name || null,
        userData.last_name || null,
      ]
    )
    return users[0]
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ')

    if (!setClause) return this.findById(id)

    const values = [id, ...Object.values(updates)]

    const users = await query<User>(
      `UPDATE users SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    )
    return users[0] || null
  }

  async delete(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM users WHERE id = $1',
      [id]
    )
    return result.length > 0
  }
}
