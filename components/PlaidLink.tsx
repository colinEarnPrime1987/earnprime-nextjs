'use client'

import { apiClient } from '@/lib/api-client'
import { useCallback, useEffect, useState } from 'react'
import { usePlaidLink } from 'react-plaid-link'
import EPButton from './base/EPButton'

interface PlaidLinkProps {
  onSuccess: (publicToken: string, metadata: any) => void
  onExit?: (error: any, metadata: any) => void
  buttonText?: string
  buttonVariant?: 'primary' | 'secondary' | 'outline' | 'ghost'
}

export default function PlaidLink({
  onSuccess,
  onExit,
  buttonText = 'Connect Bank Account',
  buttonVariant = 'primary',
}: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch link token on component mount
  useEffect(() => {
    async function fetchLinkToken() {
      try {
        const response = await apiClient.createLinkToken()
        setLinkToken(response.data?.link_token || null)
      } catch (error) {
        console.error('Error fetching link token:', error)
      }
    }

    fetchLinkToken()
  }, [])

  const onSuccessCallback = useCallback(
    (public_token: string, metadata: any) => {
      // Send public token to server
      onSuccess(public_token, metadata)
    },
    [onSuccess]
  )

  const onExitCallback = useCallback(
    (error: any, metadata: any) => {
      if (error) {
        console.error('Plaid Link error:', error)
      }
      if (onExit) {
        onExit(error, metadata)
      }
    },
    [onExit]
  )

  const config = {
    token: linkToken,
    onSuccess: onSuccessCallback,
    onExit: onExitCallback,
  }

  const { open, ready } = usePlaidLink(config)

  const handleClick = () => {
    setLoading(true)
    open()
    // Reset loading after a short delay
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <EPButton onClick={handleClick} disabled={!ready || loading} variant={buttonVariant} fullWidth>
      {loading ? 'Opening...' : buttonText}
    </EPButton>
  )
}
