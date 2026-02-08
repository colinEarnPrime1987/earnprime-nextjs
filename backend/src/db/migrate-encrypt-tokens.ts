import 'dotenv/config'
import { query, closePool } from '@/db/connection'
import { encrypt, isEncrypted } from '@/utils/crypto'

async function migrateEncryptTokens() {
  console.log('Starting access token encryption migration...')

  const items = await query<{ id: string; access_token: string }>(
    'SELECT id, access_token FROM plaid_items'
  )

  let encrypted = 0
  let skipped = 0

  for (const item of items) {
    if (isEncrypted(item.access_token)) {
      skipped++
      continue
    }

    const encryptedToken = encrypt(item.access_token)
    await query('UPDATE plaid_items SET access_token = $1 WHERE id = $2', [
      encryptedToken,
      item.id,
    ])
    encrypted++
  }

  console.log(`Migration complete: ${encrypted} tokens encrypted, ${skipped} already encrypted`)
  await closePool()
}

migrateEncryptTokens().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
