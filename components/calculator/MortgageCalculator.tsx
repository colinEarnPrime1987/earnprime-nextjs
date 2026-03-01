'use client'

import { useState, useMemo } from 'react'
import EPButton from '@/components/base/EPButton'
import { useRouter } from 'next/navigation'
import styles from './calculator.module.css'

// ── Constants ─────────────────────────────────────────────────────────────────

const TERMS = [
  { label: '30 years', years: 30 },
  { label: '20 years', years: 20 },
  { label: '15 years', years: 15 },
  { label: '10 years', years: 10 },
]

const EP_RATE = 0.0675
const EARNPRIME_TERM_DAYS = 270

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

export default function MortgageCalculator() {
  const router = useRouter()

  const [homePrice, setHomePrice] = useState(400_000)
  const [downPct, setDownPct] = useState(20)
  const [rate, setRate] = useState(6.75)
  const [termIdx, setTermIdx] = useState(0)

  const term = TERMS[termIdx]
  const downPayment = (homePrice * downPct) / 100
  const loanAmount = homePrice - downPayment
  const months = term.years * 12

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

  // EarnPrime earnings on the down payment over ~9 months
  const epDownEarnings =
    downPayment >= 25_000
      ? downPayment * (Math.pow(1 + EP_RATE / 365, EARNPRIME_TERM_DAYS) - 1)
      : 0
  const hysaDownEarnings =
    downPayment >= 25_000 ? downPayment * (Math.pow(1 + 0.035 / 365, EARNPRIME_TERM_DAYS) - 1) : 0

  return (
    <div className={styles.calcCard}>
      {/* ── Home Price ── */}
      <div className={styles.inputGroup}>
        <div className={styles.inputLabel}>
          <span>Home Price</span>
          <span className={styles.inputLabelValue}>{fmt(homePrice)}</span>
        </div>
        <input
          type="range"
          className={styles.slider}
          min={100_000}
          max={2_000_000}
          step={10_000}
          value={homePrice}
          onChange={e => setHomePrice(Number(e.target.value))}
          aria-label="Home price"
        />
        <div className={styles.sliderRange}>
          <span>$100K</span>
          <span>$2M</span>
        </div>
      </div>

      {/* ── Down Payment + Interest Rate ── */}
      <div className={styles.inputRow}>
        <div>
          <div className={styles.inputLabel}>
            <span>Down Payment</span>
            <span className={styles.inputLabelValue}>
              {downPct}% = {fmt(downPayment)}
            </span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={3}
            max={50}
            step={1}
            value={downPct}
            onChange={e => setDownPct(Number(e.target.value))}
            aria-label="Down payment percentage"
          />
          <div className={styles.sliderRange}>
            <span>3%</span>
            <span>50%</span>
          </div>
        </div>

        <div>
          <div className={styles.inputLabel}>
            <span>Interest Rate</span>
            <span className={styles.inputLabelValue}>{rate.toFixed(2)}%</span>
          </div>
          <input
            type="range"
            className={styles.slider}
            min={2}
            max={12}
            step={0.05}
            value={rate}
            onChange={e => setRate(Number(parseFloat(e.target.value).toFixed(2)))}
            aria-label="Interest rate"
          />
          <div className={styles.sliderRange}>
            <span>2%</span>
            <span>12%</span>
          </div>
        </div>
      </div>

      {/* ── Loan Term ── */}
      <div className={styles.inputGroup}>
        <div className={styles.inputLabel}>
          <span>Loan Term</span>
        </div>
        <div className={styles.tabs}>
          {TERMS.map((t, i) => (
            <button
              key={t.label}
              className={`${styles.tab} ${i === termIdx ? styles.tabActive : ''}`}
              onClick={() => setTermIdx(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div className={styles.resultsSummary}>
        <div className={`${styles.summaryCard} ${styles.summaryCardHighlight}`}>
          <div className={styles.summaryLabel}>Monthly Payment</div>
          <div className={`${styles.summaryValue} ${styles.summaryValueHighlight}`}>
            {fmt(monthly)}
          </div>
          <div className={styles.summarySubLabel}>principal + interest</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Interest</div>
          <div className={styles.summaryValue}>{fmt(totalInterest)}</div>
          <div className={styles.summarySubLabel}>over {term.years} years</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Cost</div>
          <div className={styles.summaryValue}>{fmt(totalPaid)}</div>
          <div className={styles.summarySubLabel}>
            {fmt(loanAmount)} loan + {fmt(totalInterest)} interest
          </div>
        </div>
      </div>

      {/* ── Principal vs Interest bar ── */}
      <div className={styles.paymentBreakdown}>
        <div className={styles.breakdownTitle}>Principal vs. Interest — Over Full Term</div>
        <div className={styles.breakdownBar}>
          <div
            className={styles.breakdownBarFill}
            style={{ width: `${principalPct}%` }}
          />
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

      {/* ── EarnPrime Callout (if down payment ≥ $25K) ── */}
      {downPayment >= 25_000 && (
        <div className={styles.earnprimeCallout}>
          <div className={styles.earnprimeCalloutTitle}>
            Earn on your down payment while you close
          </div>
          <div className={styles.earnprimeCalloutText}>
            Your {fmt(downPayment)} down payment could earn{' '}
            <strong style={{ color: '#fff' }}>{fmt(epDownEarnings)}</strong> in just 9 months at
            EarnPrime&apos;s 6.75% APY — versus only {fmt(hysaDownEarnings)} in a typical HYSA.
            That&apos;s{' '}
            <strong style={{ color: 'var(--color-primary-green)' }}>
              {fmt(epDownEarnings - hysaDownEarnings)} extra
            </strong>{' '}
            while your mortgage is being processed.
          </div>
          <EPButton size="sm" onClick={() => router.push('/register')}>
            Earn 6.75% on Your Down Payment →
          </EPButton>
        </div>
      )}
    </div>
  )
}
