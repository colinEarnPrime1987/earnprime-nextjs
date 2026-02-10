'use client'

import { useState, useEffect } from 'react'
import PlaidLink from '@/components/PlaidLink'
import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api-client'

interface Account {
  id: string
  name: string
  type: string
  subtype: string
  mask: string
  current_balance: number
  available_balance: number
  currency_code: string
}

interface Transaction {
  id: string
  name: string
  amount: number
  date: string
  merchant_name: string
  category: string[]
  pending: boolean
}

export default function TestDashboard() {
  const router = useRouter()
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Data states
  const [accounts, setAccounts] = useState<Account[]>([])
  const [balances, setBalances] = useState<any[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Stats
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalBalance: 0,
    transactionCount: 0,
  })

  // Check backend status on mount
  useEffect(() => {
    checkBackendStatus()
  }, [])

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:3002/health')
      const data = await response.json()
      setBackendStatus(data.status === 'ok' ? 'online' : 'offline')
    } catch (err) {
      setBackendStatus('offline')
    }
  }

  const handlePlaidSuccess = async (publicToken: string, metadata: any) => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await apiClient.exchangePublicToken(publicToken)
      setSuccess(`✓ Bank connected: ${response.data?.institution_name || 'Success'}`)

      // Automatically fetch accounts after connection
      await fetchAccounts()
      await fetchBalances()
    } catch (err: any) {
      setError(err.message || 'Failed to connect bank')
    } finally {
      setLoading(false)
    }
  }

  const handlePlaidExit = (error: any, metadata: any) => {
    if (error) {
      setError(`Plaid error: ${error.error_message || 'Connection cancelled'}`)
    }
  }

  const fetchAccounts = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiClient.getAccounts()
      setAccounts(response.data?.accounts || [])
      setSuccess('✓ Accounts loaded')
      updateStats(response.data?.accounts || [], balances, transactions)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch accounts')
    } finally {
      setLoading(false)
    }
  }

  const fetchBalances = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiClient.getBalances()
      setBalances(response.data?.balances || [])
      setSuccess('✓ Balances updated')
      updateStats(accounts, response.data?.balances || [], transactions)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch balances')
    } finally {
      setLoading(false)
    }
  }

  const syncTransactions = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiClient.syncTransactions()
      setTransactions(response.data?.transactions || [])
      setSuccess(`✓ Synced ${response.data?.count || 0} transactions`)
      updateStats(accounts, balances, response.data?.transactions || [])
    } catch (err: any) {
      setError(err.message || 'Failed to sync transactions')
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await apiClient.getTransactions(50)
      setTransactions(response.data?.transactions || [])
      setSuccess(`✓ Loaded ${response.data?.count || 0} transactions`)
      updateStats(accounts, balances, response.data?.transactions || [])
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions')
    } finally {
      setLoading(false)
    }
  }

  const updateStats = (accts: any[], bals: any[], trans: any[]) => {
    const totalBalance = bals.reduce((sum, bal) => sum + Number(bal.current_balance || 0), 0)
    setStats({
      totalAccounts: accts.length,
      totalBalance,
      transactionCount: trans.length,
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: '2rem', color: '#fff' }}>
      <EPContainer maxWidth="xl">
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧪 EarnPrime Test Dashboard</h1>
            <p style={{ color: '#888' }}>Real-time testing of backend API and Plaid integration</p>
          </div>
          <EPButton variant="ghost" onClick={() => router.push('/')}>
            ← Back to Home
          </EPButton>
        </div>

        {/* Status Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <StatusCard
            title="Backend Status"
            value={backendStatus === 'online' ? '🟢 Online' : backendStatus === 'checking' ? '🟡 Checking...' : '🔴 Offline'}
            subtitle="Port 3002"
          />
          <StatusCard
            title="Total Accounts"
            value={stats.totalAccounts.toString()}
            subtitle="Connected accounts"
          />
          <StatusCard
            title="Total Balance"
            value={`$${stats.totalBalance.toFixed(2)}`}
            subtitle="Across all accounts"
          />
          <StatusCard
            title="Transactions"
            value={stats.transactionCount.toString()}
            subtitle="Loaded from database"
          />
        </div>

        {/* Feedback Messages */}
        {loading && (
          <MessageBox type="info">
            ⏳ Processing...
          </MessageBox>
        )}

        {error && (
          <MessageBox type="error">
            ❌ {error}
          </MessageBox>
        )}

        {success && (
          <MessageBox type="success">
            {success}
          </MessageBox>
        )}

        {/* Actions */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <PlaidLink
                onSuccess={handlePlaidSuccess}
                onExit={handlePlaidExit}
                buttonText="🏦 Connect Bank"
              />
            </div>
            <EPButton onClick={fetchAccounts} disabled={loading} variant="secondary">
              💳 Fetch Accounts
            </EPButton>
            <EPButton onClick={fetchBalances} disabled={loading} variant="secondary">
              💰 Get Balances
            </EPButton>
            <EPButton onClick={syncTransactions} disabled={loading} variant="secondary">
              🔄 Sync Transactions
            </EPButton>
            <EPButton onClick={fetchTransactions} disabled={loading} variant="outline">
              📊 Load Transactions
            </EPButton>
            <EPButton onClick={checkBackendStatus} disabled={loading} variant="outline">
              🔍 Check Backend
            </EPButton>
          </div>
        </div>

        {/* Accounts Section */}
        {accounts.length > 0 && (
          <Section title="Connected Accounts">
            <div style={{ display: 'grid', gap: '1rem' }}>
              {accounts.map((account) => (
                <AccountCard key={account.id} account={account} />
              ))}
            </div>
          </Section>
        )}

        {/* Balances Section */}
        {balances.length > 0 && (
          <Section title="Account Balances">
            <div style={{ display: 'grid', gap: '1rem' }}>
              {balances.map((balance, idx) => (
                <BalanceCard key={idx} balance={balance} />
              ))}
            </div>
          </Section>
        )}

        {/* Transactions Section */}
        {transactions.length > 0 && (
          <Section title="Recent Transactions">
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {transactions.slice(0, 20).map((transaction) => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </div>
          </Section>
        )}

        {/* Test Credentials */}
        <Section title="Test Credentials (Plaid Sandbox)">
          <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px' }}>
            <p style={{ marginBottom: '0.5rem' }}><strong>Username:</strong> user_good</p>
            <p style={{ marginBottom: '0.5rem' }}><strong>Password:</strong> pass_good</p>
            <p style={{ fontSize: '0.875rem', color: '#888' }}>
              Works with any test bank (Chase, Wells Fargo, etc.)
            </p>
          </div>
        </Section>
      </EPContainer>
    </div>
  )
}

function StatusCard({ title, value, subtitle }: { title: string; value: string; subtitle: string }) {
  return (
    <div style={{
      background: '#1a1a1a',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #333'
    }}>
      <div style={{ fontSize: '0.875rem', color: '#888', marginBottom: '0.5rem' }}>{title}</div>
      <div style={{ fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: '#666' }}>{subtitle}</div>
    </div>
  )
}

function MessageBox({ type, children }: { type: 'info' | 'error' | 'success'; children: React.ReactNode }) {
  const colors = {
    info: { bg: '#1e3a8a', border: '#3b82f6', text: '#93c5fd' },
    error: { bg: '#7f1d1d', border: '#dc2626', text: '#fca5a5' },
    success: { bg: '#14532d', border: '#16a34a', text: '#86efac' },
  }

  const color = colors[type]

  return (
    <div style={{
      background: color.bg,
      border: `1px solid ${color.border}`,
      color: color.text,
      padding: '1rem',
      borderRadius: '8px',
      marginBottom: '1rem',
    }}>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h2>
      {children}
    </div>
  )
}

function AccountCard({ account }: { account: Account }) {
  return (
    <div style={{
      background: '#1a1a1a',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #333',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
          {account.name} •••• {account.mask}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#888' }}>
          {account.type} - {account.subtype}
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>
          ${Number(account.current_balance || 0).toFixed(2)}
        </div>
        {account.available_balance !== null && (
          <div style={{ fontSize: '0.75rem', color: '#888' }}>
            Available: ${Number(account.available_balance || 0).toFixed(2)}
          </div>
        )}
      </div>
    </div>
  )
}

function BalanceCard({ balance }: { balance: any }) {
  return (
    <div style={{
      background: '#1a1a1a',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #333',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '1rem',
    }}>
      <div>
        <div style={{ fontWeight: 'bold' }}>{balance.name} •••• {balance.mask}</div>
        <div style={{ fontSize: '0.75rem', color: '#666' }}>{balance.type} - {balance.subtype}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontWeight: 'bold', color: '#22c55e' }}>
          ${Number(balance.current_balance || 0).toFixed(2)}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#888' }}>
          Avail: ${Number(balance.available_balance || 0).toFixed(2)}
        </div>
      </div>
    </div>
  )
}

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const amount = Number(transaction.amount)
  const isDebit = amount > 0

  return (
    <div style={{
      background: '#1a1a1a',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #333',
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      gap: '1rem',
      opacity: transaction.pending ? 0.6 : 1,
    }}>
      <div>
        <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
          {transaction.name}
          {transaction.pending && <span style={{ color: '#fbbf24', fontSize: '0.75rem', marginLeft: '0.5rem' }}>PENDING</span>}
        </div>
        <div style={{ fontSize: '0.75rem', color: '#666' }}>
          {new Date(transaction.date).toLocaleDateString()}
          {transaction.merchant_name && ` • ${transaction.merchant_name}`}
          {transaction.category?.length > 0 && ` • ${transaction.category[0]}`}
        </div>
      </div>
      <div style={{
        textAlign: 'right',
        fontWeight: 'bold',
        color: isDebit ? '#ef4444' : '#22c55e',
      }}>
        {isDebit ? '-' : '+'}${Math.abs(amount).toFixed(2)}
      </div>
    </div>
  )
}
