'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AnimatedBackground from '@/components/base/AnimatedBackground'
import { apiClient } from '@/lib/api-client'
import styles from './account-detail.module.css'

interface Account {
  id: string
  plaid_item_id: string
  account_id: string
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
  account_id: string
  name: string
  amount: number
  date: string
  merchant_name: string | null
  category: string[]
  pending: boolean
}

function AccountTypeIcon({ type }: { type: string }) {
  const iconProps = { width: 24, height: 24, fill: 'currentColor', viewBox: '0 0 24 24' }

  switch (type) {
    case 'depository':
      return (
        <svg {...iconProps}>
          <path d="M12 2L2 8v2h20V8L12 2zm0 2.5L18.5 8h-13L12 4.5zM4 12v6h2v-6H4zm4 0v6h2v-6H8zm4 0v6h2v-6h-2zm4 0v6h2v-6h-2zM2 20v2h20v-2H2z" />
        </svg>
      )
    case 'credit':
      return (
        <svg {...iconProps}>
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
        </svg>
      )
    case 'loan':
      return (
        <svg {...iconProps}>
          <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
        </svg>
      )
    case 'investment':
      return (
        <svg {...iconProps}>
          <path d="M3.5 18.5l6-6 4 4L22 6.92 20.59 5.5l-7.09 8.07-4-4L2 17l1.5 1.5z" />
        </svg>
      )
    default:
      return (
        <svg {...iconProps}>
          <path d="M21 7.28V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2.28A2 2 0 0022 15V9a2 2 0 00-1-1.72zM20 9v6h-7V9h7zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2H5z" />
          <circle cx="16" cy="12" r="1.5" />
        </svg>
      )
  }
}

export default function AccountDetailPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string
  const accountId = params.accountId as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [account, setAccount] = useState<Account | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loadingTxns, setLoadingTxns] = useState(false)
  const [txnAnimKey, setTxnAnimKey] = useState(0)

  const bgColor = account?.institution_primary_color || '#00EA96'

  const fetchData = useCallback(async () => {
    try {
      const [acctRes, txnRes] = await Promise.all([
        apiClient.getAccountDetail(itemId, accountId),
        apiClient.getAccountTransactions(itemId, accountId, 100),
      ])
      setAccount(acctRes.data?.account || null)
      setTransactions(txnRes.data?.transactions || [])
      setTxnAnimKey((k) => k + 1)
    } catch (err: any) {
      // If transactions fail (not synced yet), still show account
      try {
        const acctRes = await apiClient.getAccountDetail(itemId, accountId)
        setAccount(acctRes.data?.account || null)
      } catch {
        setError(err.message || 'Failed to load account')
      }
    }
  }, [itemId, accountId])

  useEffect(() => {
    fetchData().finally(() => setLoading(false))
  }, [fetchData])

  const handleSyncAndLoad = async () => {
    setLoadingTxns(true)
    setError('')
    try {
      await apiClient.syncTransactions()
      const res = await apiClient.getAccountTransactions(itemId, accountId, 100)
      setTransactions(res.data?.transactions || [])
      setTxnAnimKey((k) => k + 1)
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions')
    } finally {
      setLoadingTxns(false)
    }
  }

  const handleRefreshBalances = async () => {
    setError('')
    try {
      await apiClient.getInstitutionBalances(itemId)
      const acctRes = await apiClient.getAccountDetail(itemId, accountId)
      setAccount(acctRes.data?.account || null)
    } catch (err: any) {
      setError(err.message || 'Failed to refresh balance')
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <AnimatedBackground />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading account...</p>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className={styles.page}>
        <AnimatedBackground />
        <div className={styles.container}>
          <div className={styles.errorBanner}>Account not found</div>
          <button className={styles.backButton} onClick={() => router.back()}>
            &larr; Go Back
          </button>
        </div>
      </div>
    )
  }

  const currentBal = Number(account.current_balance || 0)
  const availableBal = Number(account.available_balance || 0)

  return (
    <div className={styles.page}>
      <AnimatedBackground />

      <div className={styles.container}>
        {/* Back button */}
        <div className={styles.topBar}>
          <button
            className={styles.backButton}
            onClick={() => router.push(`/dashboard/institution/${itemId}`)}
          >
            &larr; Back to {account.institution_name || 'Institution'}
          </button>
        </div>

        {/* Account header */}
        <div className={styles.accountHeader}>
          <div className={styles.accountHeaderIcon} style={{ backgroundColor: `${bgColor}20`, color: bgColor }}>
            <AccountTypeIcon type={account.type} />
          </div>
          <div>
            <h1 className={styles.accountHeaderName}>
              {account.name}
              {account.mask && <span className={styles.accountMask}> &bull;&bull;&bull;&bull; {account.mask}</span>}
            </h1>
            <div className={styles.accountHeaderMeta}>
              {account.institution_name} &middot; {account.subtype || account.type}
            </div>
          </div>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        {/* Balance cards */}
        <div className={styles.balanceRow}>
          <div className={styles.balanceCard}>
            <div className={styles.balanceCardLabel}>Current Balance</div>
            <div className={styles.balanceCardValue}>
              ${currentBal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className={styles.balanceCard}>
            <div className={styles.balanceCardLabel}>Available Balance</div>
            <div className={styles.balanceCardValue}>
              ${availableBal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <button className={styles.refreshBalanceBtn} onClick={handleRefreshBalances}>
            Refresh Balance
          </button>
        </div>

        {/* Transactions */}
        <section className={styles.txnSection}>
          <div className={styles.txnSectionHeader}>
            <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
              Transactions
              {transactions.length > 0 && (
                <span className={styles.txnCount}>{transactions.length}</span>
              )}
            </h2>
            <button
              className={styles.refreshBtn}
              onClick={handleSyncAndLoad}
              disabled={loadingTxns}
            >
              {loadingTxns ? 'Syncing...' : transactions.length > 0 ? 'Refresh' : 'Sync & Load'}
            </button>
          </div>

          {transactions.length === 0 && !loadingTxns && (
            <div className={styles.emptyState}>
              No transactions yet. Click &ldquo;Sync &amp; Load&rdquo; to fetch from your bank.
            </div>
          )}

          {loadingTxns && transactions.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.spinnerSmall} />
              Syncing transactions...
            </div>
          )}

          {transactions.length > 0 && (
            <div className={styles.transactionsList} key={txnAnimKey}>
              {transactions.map((txn, i) => {
                const amount = Number(txn.amount)
                const isDebit = amount > 0
                return (
                  <div
                    key={txn.id}
                    className={styles.txnRow}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
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
      </div>
    </div>
  )
}
