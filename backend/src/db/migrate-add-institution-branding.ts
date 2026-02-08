import 'dotenv/config'
import { Configuration, PlaidApi, PlaidEnvironments, CountryCode } from 'plaid'
import { query, closePool } from '@/db/connection'

function getPlaidClient(): PlaidApi {
  const configuration = new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
        'PLAID-SECRET': process.env.PLAID_SANDBOX_SECRET!,
      },
    },
  })
  return new PlaidApi(configuration)
}

async function migrate() {
  console.log('Adding institution branding columns...')

  // Add columns (idempotent)
  await query(`ALTER TABLE plaid_items ADD COLUMN IF NOT EXISTS institution_logo TEXT`)
  await query(`ALTER TABLE plaid_items ADD COLUMN IF NOT EXISTS institution_primary_color VARCHAR(10)`)
  console.log('✓ Columns added')

  // Backfill existing rows
  const items = await query<{ id: string; institution_id: string }>(
    `SELECT id, institution_id FROM plaid_items
     WHERE institution_id IS NOT NULL AND institution_logo IS NULL`
  )

  if (items.length === 0) {
    console.log('✓ No rows to backfill')
    await closePool()
    return
  }

  console.log(`Backfilling ${items.length} item(s)...`)
  const client = getPlaidClient()

  for (const item of items) {
    try {
      const resp = await client.institutionsGetById({
        institution_id: item.institution_id,
        country_codes: [CountryCode.Us],
        options: { include_optional_metadata: true },
      })
      const inst = resp.data.institution
      await query(
        `UPDATE plaid_items SET institution_logo = $1, institution_primary_color = $2 WHERE id = $3`,
        [inst.logo || null, inst.primary_color || null, item.id]
      )
      console.log(`  ✓ ${item.institution_id}`)
    } catch (err) {
      console.error(`  ✗ ${item.institution_id}:`, err)
    }
  }

  console.log('✓ Backfill complete')
  await closePool()
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
