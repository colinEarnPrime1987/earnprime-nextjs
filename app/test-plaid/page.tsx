'use client'

import { useState } from 'react'
import PlaidLink from '@/components/PlaidLink'
import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

export default function TestPlaidPage() {
  const router = useRouter()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSuccess = async (publicToken: string, metadata: any) => {
    console.log('Public token received:', publicToken)
    console.log('Metadata:', metadata)
    setLoading(true)
    setError('')

    try {
      // Exchange public token for access token
      const response = await apiClient.exchangePublicToken(publicToken)
      console.log('Exchange response:', response)
      setResult(response)
    } catch (err: any) {
      console.error('Error:', err)
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleExit = (error: any, metadata: any) => {
    if (error) {
      console.error('Plaid Link exited with error:', error)
      setError(error.error_message || 'User exited Plaid Link')
    }
    console.log('Exit metadata:', metadata)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#1a1a1a', padding: '2rem' }}>
      <EPContainer maxWidth="lg">
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <EPButton variant="ghost" onClick={() => router.push('/')}>
              ← Back to Home
            </EPButton>
          </div>

          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Plaid Integration Test</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}>
            Test the Plaid Link integration in sandbox mode. Use the credentials below to connect a test bank account.
          </p>

          <div
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '2rem',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Test Credentials</h3>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Username:</strong> user_good
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              <strong>Password:</strong> pass_good
            </p>
            <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
              These work with any test bank in the Plaid sandbox (Chase, Wells Fargo, etc.)
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <PlaidLink onSuccess={handleSuccess} onExit={handleExit} buttonText="Connect Bank Account" />
          </div>

          {loading && (
            <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px', marginBottom: '1rem' }}>
              <p style={{ color: '#1976d2', margin: 0 }}>Processing...</p>
            </div>
          )}

          {error && (
            <div style={{ padding: '1rem', background: '#ffebee', borderRadius: '8px', marginBottom: '1rem' }}>
              <p style={{ color: '#c62828', margin: 0 }}>{error}</p>
            </div>
          )}

          {result && (
            <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#2e7d32' }}>✓ Success!</h3>
              <pre
                style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '0.875rem',
                }}
              >
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div style={{ marginTop: '2rem', padding: '1rem', background: '#fff9c4', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>📝 What happens next?</h3>
            <ul style={{ paddingLeft: '1.5rem', fontSize: '0.875rem', lineHeight: '1.6' }}>
              <li>Click "Connect Bank Account" to open Plaid Link</li>
              <li>Select any test bank (Chase, Wells Fargo, etc.)</li>
              <li>Enter the test credentials above</li>
              <li>Select an account to connect</li>
              <li>View the verification results below</li>
            </ul>
          </div>
        </div>
      </EPContainer>
    </div>
  )
}
