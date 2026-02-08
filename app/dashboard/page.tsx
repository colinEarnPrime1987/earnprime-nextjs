'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AnimatedBackground from '@/components/base/AnimatedBackground'
import AnimatedLogo from '@/components/base/AnimatedLogo'
import EPButton from '@/components/base/EPButton'
import Link from 'next/link'
import PlaidLink from '@/components/PlaidLink'
import { apiClient } from '@/lib/api-client'
import styles from './dashboard.module.css'

interface Institution {
  id: string
  item_id: string
  institution_id: string | null
  institution_name: string | null
  institution_logo: string | null
  institution_primary_color: string | null
  status: string
  created_at: string
}

interface Account {
  id: string
  plaid_item_id: string
  name: string
  type: string
  subtype: string | null
  mask: string | null
  current_balance: number | null
  available_balance: number | null
  currency_code: string
  institution_name: string | null
  institution_logo: string | null
  institution_primary_color: string | null
}

interface Transaction {
  id: string
  name: string
  amount: number
  date: string
  merchant_name: string | null
  category: string[]
  pending: boolean
}

function InstitutionCardLogo({ institution }: { institution: Institution }) {
  if (institution.institution_logo) {
    return (
      <img
        className={styles.institutionCardLogo}
        src={`data:image/png;base64,${institution.institution_logo}`}
        alt={institution.institution_name || 'Bank'}
      />
    )
  }
  const initial = (institution.institution_name || '?')[0].toUpperCase()
  const bgColor = institution.institution_primary_color || '#00EA96'
  return (
    <div className={styles.institutionCardLogoFallback} style={{ backgroundColor: bgColor }}>
      {initial}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  const [loadingTxns, setLoadingTxns] = useState(false)

  // Compute per-institution aggregated balances
  const institutionBalances = institutions.map((inst) => {
    const instAccounts = accounts.filter((a) => a.plaid_item_id === inst.id)
    const totalCurrent = instAccounts.reduce(
      (sum, a) => sum + Number(a.current_balance || 0),
      0
    )
    const totalAvailable = instAccounts.reduce(
      (sum, a) => sum + Number(a.available_balance || 0),
      0
    )
    return {
      ...inst,
      accountCount: instAccounts.length,
      totalCurrent,
      totalAvailable,
    }
  })

  const totalBalance = accounts.reduce(
    (sum, a) => sum + Number(a.current_balance || 0),
    0
  )

  const fetchData = useCallback(async () => {
    try {
      const [instRes, acctRes] = await Promise.all([
        apiClient.getInstitutions(),
        apiClient.getAccounts(),
      ])
      setInstitutions(instRes.data?.institutions || [])
      setAccounts(acctRes.data?.accounts || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    }
  }, [])

  useEffect(() => {
    fetchData().finally(() => setLoading(false))
  }, [fetchData])

  const handleLoadTransactions = async () => {
    setLoadingTxns(true)
    setError('')
    try {
      await apiClient.syncTransactions()
      const res = await apiClient.getTransactions(20)
      setTransactions(res.data?.transactions || [])
      setShowAllTransactions(true)
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions')
    } finally {
      setLoadingTxns(false)
    }
  }

  const handleToggleTransactions = () => {
    if (!showAllTransactions && transactions.length === 0) {
      handleLoadTransactions()
    } else {
      setShowAllTransactions(!showAllTransactions)
    }
  }

  const handlePlaidSuccess = async (publicToken: string) => {
    setError('')
    try {
      await apiClient.exchangePublicToken(publicToken)
      await fetchData()
    } catch (err: any) {
      setError(err.message || 'Failed to connect bank')
    }
  }

  const handlePlaidExit = (err: any) => {
    if (err) {
      setError(err.error_message || 'Connection cancelled')
    }
  }

  const handleLogout = () => {
    apiClient.logout()
    document.cookie = 'sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/login')
  }

  if (loading) {
    return (
      <div className={styles.dashboardPage}>
        <AnimatedBackground />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading your finances...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboardPage}>
      <AnimatedBackground />

      <div className={styles.dashboardContainer}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Link href="/" aria-label="Back to home">
              <AnimatedLogo width={120} height={80} />
            </Link>
            <div>
              <div className={styles.greeting}>Welcome back</div>
              <div className={styles.greetingSub}>Your financial overview</div>
            </div>
          </div>
          <EPButton onClick={handleLogout} variant="outline">
            Logout
          </EPButton>
        </header>

        <main className={styles.main}>
          {/* Error banner */}
          {error && (
            <div className={styles.errorBanner}>{error}</div>
          )}

          {/* Overview stats */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Total Balance</div>
              <div className={styles.statValue}>
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statLabel}>Connected Accounts</div>
              <div className={styles.statValue}>{accounts.length}</div>
            </div>
            <div
              className={`${styles.statCard} ${styles.statCardClickable}`}
              onClick={handleToggleTransactions}
            >
              <div className={styles.statLabel}>
                Recent Transactions
                <span className={styles.statHint}>
                  {showAllTransactions ? 'Click to hide' : 'Click to view'}
                </span>
              </div>
              <div className={styles.statValue}>
                {loadingTxns ? '...' : transactions.length}
              </div>
            </div>
          </div>

          {/* Invest section */}
          <section>
            <h2 className={styles.sectionTitle}>Invest</h2>
            <div
              className={styles.investCard}
              onClick={() => router.push('/dashboard/notes')}
            >
              <div className={styles.investCardIcon}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.5 18.5l6-6 4 4L22 6.92 20.59 5.5l-7.09 8.07-4-4L2 17l1.5 1.5z" />
                </svg>
              </div>
              <div>
                <div className={styles.investCardTitle}>Notes Marketplace</div>
                <div className={styles.investCardSubtitle}>
                  Browse and invest in short-term notes with competitive APY rates
                </div>
              </div>
            </div>
          </section>

          {/* Institution Cards */}
          {institutions.length > 0 && (
            <section>
              <h2 className={styles.sectionTitle}>Your Banks</h2>
              <div className={styles.institutionsGrid}>
                {institutionBalances.map((inst) => (
                  <div
                    key={inst.id}
                    className={styles.institutionCard}
                    onClick={() => router.push(`/dashboard/institution/${inst.id}`)}
                  >
                    <div className={styles.institutionCardHeader}>
                      <InstitutionCardLogo institution={inst} />
                      <div>
                        <div className={styles.institutionCardName}>
                          {inst.institution_name || 'Connected Bank'}
                        </div>
                        <div className={styles.institutionCardMeta}>
                          {inst.accountCount} account{inst.accountCount !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                    <div className={styles.accountBalances}>
                      <div className={styles.balanceItem}>
                        <span className={styles.balanceLabel}>Current</span>
                        <span className={styles.balanceValue}>
                          ${inst.totalCurrent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className={styles.balanceItem}>
                        <span className={styles.balanceLabel}>Available</span>
                        <span className={styles.balanceValue}>
                          ${inst.totalAvailable.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Cross-bank Transactions (toggled) */}
          {showAllTransactions && (
            <section className={styles.card}>
              <div className={styles.transactionsHeader}>
                <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                  Recent Transactions
                </h2>
                <button
                  className={styles.refreshBtn}
                  onClick={handleLoadTransactions}
                  disabled={loadingTxns}
                >
                  {loadingTxns ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              {transactions.length === 0 ? (
                <div className={styles.emptyState}>
                  {loadingTxns
                    ? 'Syncing transactions...'
                    : 'No transactions found'}
                </div>
              ) : (
                <div className={styles.transactionsList}>
                  {transactions.slice(0, 20).map((txn) => {
                    const amount = Number(txn.amount)
                    const isDebit = amount > 0
                    return (
                      <div key={txn.id} className={styles.txnRow}>
                        <span className={styles.txnDate}>
                          {new Date(txn.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <div className={styles.txnDetails}>
                          <span className={styles.txnName}>{txn.name}</span>
                          <span className={styles.txnMeta}>
                            {txn.merchant_name && `${txn.merchant_name}`}
                            {txn.merchant_name && txn.category?.length > 0 && ' · '}
                            {txn.category?.length > 0 && txn.category[0]}
                          </span>
                        </div>
                        <div className={styles.txnRight}>
                          {txn.pending && (
                            <span className={styles.pendingBadge}>Pending</span>
                          )}
                          <span
                            className={`${styles.txnAmount} ${isDebit ? styles.txnDebit : styles.txnCredit}`}
                          >
                            {isDebit ? '-' : '+'}$
                            {Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </section>
          )}

          {/* Connect Bank */}
          <div className={styles.connectSection}>
            <div className={styles.connectCard}>
              <div className={styles.connectTitle}>Connect a Bank Account</div>
              <div className={styles.connectSubtitle}>
                Link your bank to view accounts, balances, and transactions
              </div>
              <PlaidLink
                onSuccess={handlePlaidSuccess}
                onExit={handlePlaidExit}
                buttonText="Connect Bank Account"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
