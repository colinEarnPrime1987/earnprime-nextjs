import { Configuration, CountryCode, PlaidApi, PlaidEnvironments, Products } from 'plaid'

// Plaid client configuration
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV as keyof typeof PlaidEnvironments] || PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SANDBOX_SECRET!,
    },
  },
})

export const plaidClient = new PlaidApi(configuration)

// Helper function to create link token
export async function createLinkToken(userId: string) {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: userId,
      },
      client_name: 'EarnPrime',
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: 'en',
    })
    return response.data
  } catch (error) {
    console.error('Error creating link token:', error)
    throw error
  }
}

// Helper function to exchange public token
export async function exchangePublicToken(publicToken: string) {
  try {
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    })
    return response.data
  } catch (error) {
    console.error('Error exchanging public token:', error)
    throw error
  }
}

// Helper function to get identity verification
export async function getIdentityVerification(accessToken: string) {
  try {
    const response = await plaidClient.identityGet({
      access_token: accessToken,
    })
    return response.data
  } catch (error) {
    console.error('Error getting identity:', error)
    throw error
  }
}

// Helper function to get auth data (account & routing numbers)
export async function getAuthData(accessToken: string) {
  try {
    const response = await plaidClient.authGet({
      access_token: accessToken,
    })
    return response.data
  } catch (error) {
    console.error('Error getting auth data:', error)
    throw error
  }
}
