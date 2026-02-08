import { NextResponse } from 'next/server'

export async function GET() {
  // Check if environment variables are loaded
  const hasClientId = !!process.env.PLAID_CLIENT_ID
  const hasSecret = !!process.env.PLAID_SANDBOX_SECRET
  const env = process.env.PLAID_ENV

  return NextResponse.json({
    status: 'Environment variables check',
    hasClientId,
    hasSecret,
    environment: env,
    // Show first/last 4 chars of client ID for verification (never show full secrets)
    clientIdPreview: process.env.PLAID_CLIENT_ID
      ? `${process.env.PLAID_CLIENT_ID.slice(0, 4)}...${process.env.PLAID_CLIENT_ID.slice(-4)}`
      : 'NOT SET',
  })
}
