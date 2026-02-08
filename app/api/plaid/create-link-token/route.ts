import { NextRequest, NextResponse } from 'next/server'
import { createLinkToken } from '@/lib/plaid'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    // Get user session
    const session = await getSession(request)

    // In sandbox mode, allow testing without authentication
    const userId = session?.userId ||
      (process.env.PLAID_ENV === 'sandbox' ? 'test-user-' + Date.now() : null)

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create link token
    const linkTokenData = await createLinkToken(userId)

    return NextResponse.json({
      link_token: linkTokenData.link_token,
      expiration: linkTokenData.expiration,
    })
  } catch (error) {
    console.error('Error creating link token:', error)
    return NextResponse.json(
      { error: 'Failed to create link token' },
      { status: 500 }
    )
  }
}
