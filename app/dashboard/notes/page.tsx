'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AnimatedBackground from '@/components/base/AnimatedBackground'
import { apiClient } from '@/lib/api-client'
import styles from './notes.module.css'

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

function StatusBadge({ status }: { status: string }) {
  const classMap: Record<string, string> = {
    active: styles.statusActive,
    coming_soon: styles.statusComingSoon,
    closed: styles.statusClosed,
  }
  const labelMap: Record<string, string> = {
    active: 'Active',
    coming_soon: 'Coming Soon',
    closed: 'Closed',
  }
  return (
    <span className={`${styles.statusBadge} ${classMap[status] || ''}`}>
      {labelMap[status] || status}
    </span>
  )
}

function RiskBadge({ level }: { level: string }) {
  const classMap: Record<string, string> = {
    low: styles.riskLow,
    medium: styles.riskMedium,
    high: styles.riskHigh,
  }
  return (
    <span className={`${styles.riskBadge} ${classMap[level] || ''}`}>
      {level} risk
    </span>
  )
}

export default function NotesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notes, setNotes] = useState<Note[]>([])

  const fetchNotes = useCallback(async () => {
    try {
      const res = await apiClient.getNotes()
      setNotes(res.data?.notes || [])
    } catch (err: any) {
      setError(err.message || 'Failed to load notes')
    }
  }, [])

  useEffect(() => {
    fetchNotes().finally(() => setLoading(false))
  }, [fetchNotes])

  const activeNotes = notes.filter((n) => n.status === 'active')
  const highestApy = notes.length > 0
    ? Math.max(...notes.map((n) => Number(n.apy_rate)))
    : 0
  const totalAvailable = activeNotes.reduce(
    (sum, n) => sum + (Number(n.max_capacity) - Number(n.current_invested)),
    0
  )

  if (loading) {
    return (
      <div className={styles.page}>
        <AnimatedBackground />
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading notes...</p>
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
          <button className={styles.myInvestmentsButton} onClick={() => router.push('/dashboard/notes/purchases')}>
            My Investments
          </button>
        </div>

        <h1 className={styles.pageTitle}>Investment Notes</h1>

        {error && <div className={styles.errorBanner}>{error}</div>}

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Active Notes</div>
            <div className={styles.statValue}>{activeNotes.length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Highest APY</div>
            <div className={styles.statValue}>{highestApy.toFixed(2)}%</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Total Available</div>
            <div className={styles.statValue}>
              ${totalAvailable.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>

        {/* Notes grid */}
        <div className={styles.notesGrid}>
          {notes.map((note) => {
            const isDisabled = note.status !== 'active'
            const invested = Number(note.current_invested)
            const capacity = Number(note.max_capacity)
            const remaining = capacity - invested
            const pct = capacity > 0 ? (invested / capacity) * 100 : 0

            return (
              <div
                key={note.id}
                className={`${styles.noteCard} ${isDisabled ? styles.noteCardDisabled : ''}`}
                onClick={() => !isDisabled && router.push(`/dashboard/notes/${note.id}`)}
              >
                <div className={styles.noteCardHeader}>
                  <div className={styles.noteCardName}>{note.name}</div>
                  <StatusBadge status={note.status} />
                </div>

                <div className={styles.noteApy}>
                  {Number(note.apy_rate).toFixed(2)}%
                  <span className={styles.noteApyLabel}> APY</span>
                </div>

                <div className={styles.noteDetailsRow}>
                  <span className={styles.noteDetailItem}>
                    Term: <span className={styles.noteDetailValue}>{note.term_months}mo</span>
                  </span>
                  <span className={styles.noteDetailItem}>
                    Min: <span className={styles.noteDetailValue}>
                      ${Number(note.min_investment).toLocaleString('en-US')}
                    </span>
                  </span>
                  <RiskBadge level={note.risk_rating} />
                </div>

                <div className={styles.noteMaturity}>
                  Maturity: {new Date(note.maturity_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>

                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                  <div className={styles.progressLabel}>
                    ${remaining.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} of ${capacity.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} available
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
