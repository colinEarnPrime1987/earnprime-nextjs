'use client'

import { useState, useMemo } from 'react'
import EPButton from '@/components/base/EPButton'
import { useRouter } from 'next/navigation'
import styles from './calculator.module.css'

// ── Constants ─────────────────────────────────────────────────────────────────

const LOAN_TYPES = [
  { label: 'Personal Loan', defaultRate: 11.5, defaultTerm: 5 },
  { label: 'Auto Loan', defaultRate: 7.0, defaultTerm: 5 },
  { label: 'Student Loan', defaultRate: 6.5, defaultTerm: 10 },
  { label: 'Business Loan', defaultRate: 9.0, defaultTerm: 5 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

function monthlyPayment(loanAmt: number, annualRate: number, months: number): number {
  if (annualRate === 0) return loanAmt / months
  const r = annualRate / 12
  return (loanAmt * (r * Math.pow(1 + r, months))) / (Math.pow(1 + r, months) - 1)
}

function fmt(n: number, decimals = 0): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n)
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoanCalculator() {
  const router = useRouter()

  const [loanTypeIdx, setLoanTypeIdx] = useState(0)
  const [loanAmount, setLoanAmount] = useState(25_000)
  const [rate, setRate] = useState(LOAN_TYPES[0].defaultRate)
  const [termYears, setTermYears] = useState(LOAN_TYPES[0].defaultTerm)

  const handleLoanTypeChange = (idx: number) => {
    setLoanTypeIdx(idx)
    setRate(LOAN_TYPES[idx].defaultRate)
    setTermYears(LOAN_TYPES[idx].defaultTerm)
  }

  const months = termYears * 12

  const { monthly, totalPaid, totalInterest, principalPct } = useMemo(() => {
    const m = monthlyPayment(loanAmount, rate / 100, months)
    const total = m * months
    const interest = total - loanAmount
    return {
      monthly: m,
      totalPaid: total,
      totalInterest: interest,
      principalPct: (loanAmount / total) * 100,
    }
  }, [loanAmount, rate, months])

  return (
    <div className={styles.calcCard}>
      {/* ── Loan Type ── */}
      <div className={styles.inputGroup}>
        <div className={styles.inputLabel}>
          <span>Loan Type</span>
        </div>
        <div className={styles.tabs}>
          {LOAN_TYPES.map((t, i) => (
            <button
              key={t.label}
              className={`${styles.tab} ${i === loanTypeIdx ? styles.tabActive : ''}`}
              onClick={() => handleLoanTypeChange(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Loan Amount ── */}
      <div className={styles.inputGroup}>
        <div className={styles.inputLabel}>
          <span>Loan Amount</span>
          <span className={styles.inputLabelValue}>{fmt(loanAmount)}</span>
        </div>
        <input
          type="range"
          className={styles.slider}
          min={1_000}
          max={500_000}
          step={1_000}
          value={loanAmount}
          onChange={e => setLoanAmount(Number(e.target.value))}
          aria-label="Loan amount"
        />
        <div className={styles.sliderRange}>
          <span>$1K</span>
          <span>$500K</span>
        </div>
      </div>

      {/* ── Rate + Term ── */}
      <div className={styles.inputRow}>
        <div>
          <div className={styles.inputLabel}>
            <span>Interest Rate</span>
            <span className={styles.inputLabelValue}>{rate.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={1}
            max={36}
            step={0.25}
            value={rate}
            onChange={e => setRate(Number(parseFloat(e.target.value).toFixed(2)))}
            aria-label="Interest rate"
          />
          <div className={styles.sliderRange}>
            <span>1%</span>
            <span>36%</span>
          </div>
        </div>

        <div>
          <div className={styles.inputLabel}>
            <span>Loan Term</span>
            <span className={styles.inputLabelValue}>
              {termYears} yr{termYears !== 1 ? 's' : ''}
            </span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={1}
            max={30}
            step={1}
            value={termYears}
            onChange={e => setTermYears(Number(e.target.value))}
            aria-label="Loan term in years"
          />
          <div className={styles.sliderRange}>
            <span>1 yr</span>
            <span>30 yrs</span>
          </div>
        </div>
      </div>

      {/* ── Results ── */}
      <div className={styles.resultsSummary}>
        <div className={`${styles.summaryCard} ${styles.summaryCardHighlight}`}>
          <div className={styles.summaryLabel}>Monthly Payment</div>
          <div className={`${styles.summaryValue} ${styles.summaryValueHighlight}`}>
            {fmt(monthly)}
          </div>
          <div className={styles.summarySubLabel}>per month</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Interest</div>
          <div className={styles.summaryValue}>{fmt(totalInterest)}</div>
          <div className={styles.summarySubLabel}>
            {((totalInterest / loanAmount) * 100).toFixed(0)}% of loan amount
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Repaid</div>
          <div className={styles.summaryValue}>{fmt(totalPaid)}</div>
          <div className={styles.summarySubLabel}>
            {fmt(loanAmount)} principal + {fmt(totalInterest)} interest
          </div>
        </div>
      </div>

      {/* ── Principal vs Interest bar ── */}
      <div className={styles.paymentBreakdown}>
        <div className={styles.breakdownTitle}>Principal vs. Interest</div>
        <div className={styles.breakdownBar}>
          <div className={styles.breakdownBarFill} style={{ width: `${principalPct}%` }} />
        </div>
        <div className={styles.breakdownLegend}>
          <div className={styles.breakdownLegendItem}>
            <div className={`${styles.breakdownLegendDot} ${styles.breakdownLegendDotPrimary}`} />
            <span>
              Principal — {fmt(loanAmount)} ({principalPct.toFixed(0)}%)
            </span>
          </div>
          <div className={styles.breakdownLegendItem}>
            <div
              className={`${styles.breakdownLegendDot} ${styles.breakdownLegendDotSecondary}`}
            />
            <span>
              Interest — {fmt(totalInterest)} ({(100 - principalPct).toFixed(0)}%)
            </span>
          </div>
        </div>
      </div>

      {/* ── EarnPrime Callout ── */}
      <div className={styles.earnprimeCallout}>
        <div className={styles.earnprimeCalloutTitle}>
          Instead of borrowing — what if you invested?
        </div>
        <div className={styles.earnprimeCalloutText}>
          If you have savings you&apos;d like to grow before making a large purchase, EarnPrime Short
          Term Notes earn <strong style={{ color: '#fff' }}>6.75% APY</strong> — fixed for 270 days
          with no fees. Your money works for you instead of working for a lender.
        </div>
        <EPButton size="sm" onClick={() => router.push('/register')}>
          Earn 6.75% APY with EarnPrime →
        </EPButton>
      </div>
    </div>
  )
}
