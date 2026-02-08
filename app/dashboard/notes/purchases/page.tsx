'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AnimatedBackground from '@/components/base/AnimatedBackground'
import { apiClient } from '@/lib/api-client'
import styles from './purchases.module.css'

interface Purchase {
  id: string
  note_id: string
  amount: number
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
  created_at: string
  note_name: string
  note_apy_rate: number
  note_term_months: number
  bank_account_name: string
  bank_account_mask: string | null
  institution_name: string | null
}

export default function MyPurchasesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [purchases, setPurchases] = useState<Purchase[]>([])

  const fetchPurchases = useCallback(async () => {
    try {
      const res = await apiClient.getMyPurchases()
      setPurchases(res.data?.purchases || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load purchases')
    }
  }, [])

  useEffect(() => {
    fetchPurchases().finally(() => setLoading(false))
  }, [fetchPurchases])

  const totalInvested = purchases
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0)

  const activeCount = purchases.filter((p) => p.status === 'completed').length

  const weightedApy = activeCount > 0
    ? purchases
        .filter((p) => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.note_apy_rate) * Number(p.amount), 0) / totalInvested
    : 0

  const statusClassMap: Record<string, string> = {
    completed: styles.statusCompleted,
    pending: styles.statusPending,
    failed: styles.statusFailed,
    cancelled: styles.statusCancelled,
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <AnimatedBackground />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading your investments...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <AnimatedBackground />

      <div className={styles.container}>
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={() => router.push('/dashboard/notes')}>
            &larr; Back to Notes
          </button>
        </div>

        <h1 className={styles.pageTitle}>My Investments</h1>

        {error && <div className={styles.errorBanner}>{error}</div>}

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Invested</div>
            <div className={styles.statValue}>
              ${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Active Investments</div>
            <div className={styles.statValue}>{activeCount}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Avg APY</div>
            <div className={styles.statValue}>{weightedApy.toFixed(2)}%</div>
          </div>
        </div>

        {/* Purchases */}
        {purchases.length === 0 ? (
          <div className={styles.emptyState}>
            You haven&apos;t made any investments yet.
            <div className={styles.emptyStateAction}>
              <button
                className={styles.browseButton}
                onClick={() => router.push('/dashboard/notes')}
              >
                Browse Notes
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.purchasesGrid}>
            {purchases.map((purchase) => (
              <div key={purchase.id} className={styles.purchaseCard}>
                <div className={styles.purchaseCardHeader}>
                  <div className={styles.purchaseNoteName}>{purchase.note_name}</div>
                  <span className={`${styles.statusBadge} ${statusClassMap[purchase.status] || ''}`}>
                    {purchase.status}
                  </span>
                </div>

                <div className={styles.purchaseAmount}>
                  ${Number(purchase.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>

                <div className={styles.purchaseDetails}>
                  <div className={styles.purchaseDetailRow}>
                    <span className={styles.purchaseDetailLabel}>APY Rate</span>
                    <span className={styles.purchaseDetailValue}>{Number(purchase.note_apy_rate).toFixed(2)}%</span>
                  </div>
                  <div className={styles.purchaseDetailRow}>
                    <span className={styles.purchaseDetailLabel}>Term</span>
                    <span className={styles.purchaseDetailValue}>{purchase.note_term_months} months</span>
                  </div>
                  <div className={styles.purchaseDetailRow}>
                    <span className={styles.purchaseDetailLabel}>Purchased</span>
                    <span className={styles.purchaseDetailValue}>
                      {new Date(purchase.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <div className={styles.fundedFrom}>
                  Funded from: {purchase.institution_name} - {purchase.bank_account_name}
                  {purchase.bank_account_mask ? ` ····${purchase.bank_account_mask}` : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
