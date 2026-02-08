'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import AnimatedBackground from '@/components/base/AnimatedBackground'
import { apiClient } from '@/lib/api-client'
import styles from './note-detail.module.css'

interface Note {
  id: string
  name: string
  description: string | null
  term_months: number
  apy_rate: number
  min_investment: number
  max_capacity: number
  current_invested: number
  risk_rating: 'low' | 'medium' | 'high'
  maturity_date: string
  status: 'active' | 'closed' | 'coming_soon'
}

interface BankAccount {
  id: string
  name: string
  mask: string | null
  type: string
  institution_name: string | null
}

export default function NoteDetailPage() {
  const router = useRouter()
  const params = useParams()
  const noteId = params.id as string

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [note, setNote] = useState<Note | null>(null)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])

  // Purchase form
  const [amount, setAmount] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('')
  const [purchasing, setPurchasing] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState(false)
  const [purchasedAmount, setPurchasedAmount] = useState(0)

  const fetchData = useCallback(async () => {
    try {
      const [noteRes, acctRes] = await Promise.all([
        apiClient.getNote(noteId),
        apiClient.getAccounts(),
      ])
      setNote(noteRes.data?.note || null)
      setBankAccounts(acctRes.data?.accounts || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load data')
    }
  }, [noteId])

  useEffect(() => {
    fetchData().finally(() => setLoading(false))
  }, [fetchData])

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!note || !selectedAccount || !amount) return

    setPurchasing(true)
    setError('')
    try {
      await apiClient.purchaseNote(note.id, selectedAccount, parseFloat(amount))
      setPurchasedAmount(parseFloat(amount))
      setPurchaseSuccess(true)
      // Refresh note data to show updated capacity
      const noteRes = await apiClient.getNote(noteId)
      setNote(noteRes.data?.note || null)
    } catch (err: any) {
      setError(err.message || 'Purchase failed')
    } finally {
      setPurchasing(false)
    }
  }

  const statusClass: Record<string, string> = {
    active: styles.statusActive,
    coming_soon: styles.statusComingSoon,
    closed: styles.statusClosed,
  }
  const statusLabel: Record<string, string> = {
    active: 'Active',
    coming_soon: 'Coming Soon',
    closed: 'Closed',
  }
  const riskClass: Record<string, string> = {
    low: styles.riskLow,
    medium: styles.riskMedium,
    high: styles.riskHigh,
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <AnimatedBackground />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading note...</p>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className={styles.page}>
        <AnimatedBackground />
        <div className={styles.container}>
          <div className={styles.topBar}>
            <button className={styles.backButton} onClick={() => router.push('/dashboard/notes')}>
              &larr; Back to Notes
            </button>
          </div>
          <div className={styles.errorBanner}>Note not found</div>
        </div>
      </div>
    )
  }

  const invested = Number(note.current_invested)
  const capacity = Number(note.max_capacity)
  const remaining = capacity - invested
  const pct = capacity > 0 ? (invested / capacity) * 100 : 0
  const isActive = note.status === 'active'

  return (
    <div className={styles.page}>
      <AnimatedBackground />

      <div className={styles.container}>
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={() => router.push('/dashboard/notes')}>
            &larr; Back to Notes
          </button>
        </div>

        {/* Header */}
        <div className={styles.noteHeader}>
          <h1 className={styles.noteTitle}>{note.name}</h1>
          <span className={`${styles.statusBadge} ${statusClass[note.status] || ''}`}>
            {statusLabel[note.status] || note.status}
          </span>
        </div>

        {error && <div className={styles.errorBanner}>{error}</div>}

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>APY Rate</div>
            <div className={styles.statValue}>{Number(note.apy_rate).toFixed(2)}%</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Term</div>
            <div className={styles.statValue}>{note.term_months} mo</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Maturity Date</div>
            <div className={styles.statValue} style={{ fontSize: '1.25rem' }}>
              {new Date(note.maturity_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>About This Note</h2>
          <p className={styles.descriptionText}>{note.description}</p>
          <span className={`${styles.riskBadge} ${riskClass[note.risk_rating] || ''}`}>
            {note.risk_rating} risk
          </span>
        </div>

        {/* Availability */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Availability</h2>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <div className={styles.progressLabel}>
              ${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })} of ${capacity.toLocaleString('en-US', { minimumFractionDigits: 2 })} remaining
            </div>
          </div>
        </div>

        {/* Success card */}
        {purchaseSuccess && (
          <div className={styles.successCard}>
            <div className={styles.successTitle}>Investment Confirmed</div>
            <div className={styles.successAmount}>
              ${purchasedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <p className={styles.successDetail}>
              Your investment in {note.name} has been processed successfully.
            </p>
          </div>
        )}

        {/* Purchase form — only for active notes */}
        {isActive && !purchaseSuccess && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Invest in This Note</h2>
            <form className={styles.purchaseForm} onSubmit={handlePurchase}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Investment Amount</label>
                <input
                  className={styles.formInput}
                  type="number"
                  min={Number(note.min_investment)}
                  max={remaining}
                  step="0.01"
                  placeholder={`Min $${Number(note.min_investment).toLocaleString('en-US')}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
                <span className={styles.formHint}>
                  Min investment: ${Number(note.min_investment).toLocaleString('en-US')} &middot; Remaining capacity: ${remaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Fund From</label>
                <select
                  className={styles.formSelect}
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  required
                >
                  <option value="">Select a bank account</option>
                  {bankAccounts.map((acct) => (
                    <option key={acct.id} value={acct.id}>
                      {acct.institution_name} - {acct.name}
                      {acct.mask ? ` ····${acct.mask}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className={styles.purchaseButton}
                type="submit"
                disabled={purchasing || !amount || !selectedAccount}
              >
                {purchasing ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
