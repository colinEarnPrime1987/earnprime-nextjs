import * as fs from 'fs'
import * as path from 'path'
import dotenv from 'dotenv'
import { getPool } from './connection'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') })

async function migrate() {
  console.log('Starting database migration...')

  try {
    const pool = getPool()

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf-8')

    // Execute schema
    await pool.query(schema)

    console.log('✓ Database migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('✗ Database migration failed:', error)
    process.exit(1)
  }
}

migrate()
