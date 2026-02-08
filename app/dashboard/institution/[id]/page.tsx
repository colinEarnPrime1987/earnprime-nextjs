'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AnimatedBackground from '@/components/base/AnimatedBackground'
import { apiClient } from '@/lib/api-client'
import styles from './institution-detail.module.css'

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

interface Balance {
  account_id: string
  name: string
  type: string
  subtype: string | null
  mask: string | null
  current_balance: number | null
  available_balance: number | null
  currency_code: string
}

const ACCOUNT_TYPE_CONFIG: Record<string, { label: string; order: number }> = {
  depository: { label: 'Bank Accounts', order: 0 },
  credit: { label: 'Credit Cards', order: 1 },
  loan: { label: 'Loans', order: 2 },
  investment: { label: 'Investments', order: 3 },
}

function groupAccountsByType(accounts: Account[]) {
  const groups: Record<string, Account[]> = {}
  for (const account of accounts) {
    const type = account.type || 'other'
    if (!groups[type]) groups[type] = []
    groups[type].push(account)
  }
  return Object.entries(groups).sort(([a], [b]) => {
    const orderA = ACCOUNT_TYPE_CONFIG[a]?.order ?? 99
    const orderB = ACCOUNT_TYPE_CONFIG[b]?.order ?? 99
    return orderA - orderB
  })
}

function AccountTypeIcon({ type }: { type: string }) {
  const iconProps = { width: 20, height: 20, fill: 'currentColor', viewBox: '0 0 24 24' }

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

function AccountIcon({ account }: { account: Account }) {
  const bgColor = account.institution_primary_color || '#00EA96'
  return (
    <div className={styles.accountIconBox} style={{ backgroundColor: `${bgColor}20`, color: bgColor }}>
      <AccountTypeIcon type={account.type} />
    </div>
  )
}

export default function InstitutionDetailPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [accounts, setAccounts] = useState<Account[]>([])
  const [balances, setBalances] = useState<Balance[]>([])
  const [refreshingBalances, setRefreshingBalances] = useState(false)
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)

  const institutionName = accounts[0]?.institution_name || 'Institution'
  const institutionLogo = accounts[0]?.institution_logo || null
  const institutionColor = accounts[0]?.institution_primary_color || '#00EA96'

  const totalBalance = accounts.reduce(
    (sum, a) => sum + Number(a.current_balance || 0),
    0
  )

  const balancesByPlaidId: Record<string, Balance> = {}
  for (const b of balances) {
    balancesByPlaidId[b.account_id] = b
  }

  const fetchData = useCallback(async () => {
    try {
      const res = await apiClient.getInstitutionAccounts(itemId)
      setAccounts(res.data?.accounts || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load institution data')
    }
  }, [itemId])

  useEffect(() => {
    fetchData().finally(() => setLoading(false))
  }, [fetchData])

  const handleDisconnect = async () => {
    setDisconnecting(true)
    setError('')
    try {
      await apiClient.disconnectInstitution(itemId)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect institution')
      setDisconnecting(false)
      setShowDisconnectConfirm(false)
    }
  }

  const handleRefreshBalances = async () => {
    setRefreshingBalances(true)
    setError('')
    try {
      const res = await apiClient.getInstitutionBalances(itemId)
      setBalances(res.data?.balances || [])
      const acctRes = await apiClient.getInstitutionAccounts(itemId)
      setAccounts(acctRes.data?.accounts || [])
    } catch (err: any) {
      setError(err.message || 'Failed to refresh balances')
    } finally {
      setRefreshingBalances(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <AnimatedBackground />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading institution...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <AnimatedBackground />

      <div className={styles.container}>
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={() => router.push('/dashboard')}>
            &larr; Back to Dashboard
          </button>
        </div>

        <div className={styles.institutionHeader}>
          {institutionLogo ? (
            <img
              className={styles.institutionHeaderLogo}
              src={`data:image/png;base64,${institutionLogo}`}
              alt={institutionName}
            />
          ) : (
            <div
              className={styles.institutionHeaderLogoFallback}
              style={{ backgroundColor: institutionColor }}
            >
              {institutionName[0].toUpperCase()}
            </div>
          )}
          <h1 className={styles.institutionHeaderName}>{institutionName}</h1>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Balance</div>
            <div className={styles.statValue}>
              ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Accounts</div>
            <div className={styles.statValue}>{accounts.length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Status</div>
            <div className={styles.statValue} style={{ fontSize: '1.25rem' }}>
              {refreshingBalances ? 'Refreshing...' : 'Active'}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className={styles.actionRow}>
          <button
            className={styles.refreshBtn}
            onClick={handleRefreshBalances}
            disabled={refreshingBalances}
          >
            {refreshingBalances ? 'Refreshing Balances...' : 'Refresh Balances'}
          </button>
          <button
            className={styles.disconnectBtn}
            onClick={() => setShowDisconnectConfirm(true)}
          >
            Disconnect Bank
          </button>
        </div>

        {/* Account cards — clickable to account detail */}
        {accounts.length > 0 && (
          <section>
            <h2 className={styles.sectionTitle}>Accounts</h2>
            {groupAccountsByType(accounts).map(([type, groupAccounts]) => (
              <div key={type} className={styles.accountTypeGroup}>
                <div className={styles.accountTypeHeader}>
                  <span>{ACCOUNT_TYPE_CONFIG[type]?.label || type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  <span className={styles.accountTypeCount}>{groupAccounts.length}</span>
                </div>
                <div className={styles.accountsGrid}>
                  {groupAccounts.map((account) => {
                    const liveBalance = balancesByPlaidId[account.account_id]
                    const currentBal = liveBalance
                      ? Number(liveBalance.current_balance || 0)
                      : Number(account.current_balance || 0)
                    const availableBal = liveBalance
                      ? Number(liveBalance.available_balance || 0)
                      : Number(account.available_balance || 0)

                    return (
                      <div
                        key={account.id}
                        className={styles.accountCard}
                        onClick={() => router.push(`/dashboard/institution/${itemId}/account/${account.id}`)}
                      >
                        <div className={styles.accountCardHeader}>
                          <AccountIcon account={account} />
                          <div>
                            <div className={styles.accountName}>
                              {account.name}
                              {account.mask && <> &bull;&bull;&bull;&bull; {account.mask}</>}
                            </div>
                            <div className={styles.accountMeta}>
                              {account.subtype || account.type}
                              {liveBalance && (
                                <span className={styles.liveDot} title="Live balance" />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={styles.accountBalances}>
                          <div className={styles.balanceItem}>
                            <span className={styles.balanceLabel}>Current</span>
                            <span className={styles.balanceValue}>
                              ${currentBal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <div className={styles.balanceItem}>
                            <span className={styles.balanceLabel}>Available</span>
                            <span className={styles.balanceValue}>
                              ${availableBal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                        <div className={styles.viewAccountHint}>View transactions &rarr;</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </section>
        )}
      </div>

      {showDisconnectConfirm && (
        <div className={styles.modalOverlay} onClick={() => !disconnecting && setShowDisconnectConfirm(false)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Disconnect {institutionName}?</h2>
            <p className={styles.modalText}>
              This will remove all accounts and transaction history for {institutionName}. This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button
                className={styles.modalCancel}
                onClick={() => setShowDisconnectConfirm(false)}
                disabled={disconnecting}
              >
                Cancel
              </button>
              <button
                className={styles.modalConfirm}
                onClick={handleDisconnect}
                disabled={disconnecting}
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
