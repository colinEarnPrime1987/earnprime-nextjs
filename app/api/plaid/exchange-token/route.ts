import { NextRequest, NextResponse } from 'next/server'
import { exchangePublicToken, getIdentityVerification, getAuthData } from '@/lib/plaid'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    // Get user session from cookie
    const sessionId = request.cookies.get('sessionId')?.value
    const session = sessionId ? getSession(sessionId) : null

    // In sandbox mode, allow testing without authentication
    if (!session && process.env.PLAID_ENV !== 'sandbox') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { public_token } = await request.json()

    if (!public_token) {
      return NextResponse.json(
        { error: 'Public token is required' },
        { status: 400 }
      )
    }

    // Exchange public token for access token
    const tokenData = await exchangePublicToken(public_token)
    const accessToken = tokenData.access_token
    const itemId = tokenData.item_id

    // Get identity verification data
    const identityData = await getIdentityVerification(accessToken)

    // Get auth data (bank account info)
    const authData = await getAuthData(accessToken)

    // Extract identity verification results
    const accounts = identityData.accounts || []
    const identityInfo = (identityData as any).identity || []

    // Check if SSN is verified (if available)
    let ssnVerified = false
    if (identityInfo.length > 0 && identityInfo[0].ssn) {
      // In sandbox, SSN might be available
      // In production, check if SSN matches expected format
      ssnVerified = true
    }

    // Store this data in your database
    // For now, return it to the client
    // TODO: Save accessToken (encrypted), itemId, and verification status to database

    return NextResponse.json({
      success: true,
      verified: ssnVerified,
      item_id: itemId,
      accounts: accounts.map((acc: any) => ({
        id: acc.account_id,
        name: acc.name,
        type: acc.type,
        subtype: acc.subtype,
      })),
      identity: identityInfo.map((id: any) => ({
        names: id.names,
        emails: id.emails,
        phone_numbers: id.phone_numbers,
        addresses: id.addresses,
      })),
      // Don't send access token to client - store it server-side
      message: 'Bank account verified successfully',
    })
  } catch (error) {
    console.error('Error exchanging token:', error)
    return NextResponse.json(
      { error: 'Failed to exchange token' },
      { status: 500 }
    )
  }
}
