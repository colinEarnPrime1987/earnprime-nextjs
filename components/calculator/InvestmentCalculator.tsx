'use client'

import EPButton from '@/components/base/EPButton'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import styles from './calculator.module.css'

// ── Data ──────────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    id: 'mm',
    label: 'Money Market / HYSA',
    rate: 0.035,
    rateLabel: '3.50%',
    compound: 'daily' as const,
    termLabel: 'No lock-up',
    highlight: false,
  },
  {
    id: 'cd',
    label: 'Bank CD (1-Year)',
    rate: 0.04,
    rateLabel: '4.00%',
    compound: 'daily' as const,
    termLabel: '12-month term',
    highlight: false,
  },
  {
    id: 'annuity',
    label: 'Fixed Annuity (5-year)',
    rate: 0.065,
    rateLabel: '6.50%',
    compound: 'annual' as const,
    termLabel: '5+ year lock-up',
    highlight: false,
  },
  {
    id: 'ep',
    label: 'EarnPrime Short Term Notes',
    rate: 0.0675,
    rateLabel: '6.75%',
    compound: 'daily' as const,
    termLabel: '270-day term',
    highlight: true,
  },
]

const PERIODS = [
  { label: '9 months', days: 270 },
  { label: '1 year', days: 365 },
  { label: '2 years', days: 730 },
  { label: '5 years', days: 1825 },
]

const MIN_PRINCIPAL = 25_000
const MAX_PRINCIPAL = 500_000
const DEFAULT_PRINCIPAL = 100_000

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcEarnings(principal: number, rate: number, compound: 'daily' | 'annual', days: number): number {
  if (compound === 'daily') {
    return principal * (Math.pow(1 + rate / 365, days) - 1)
  }
  return principal * (Math.pow(1 + rate, days / 365) - 1)
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

export default function InvestmentCalculator() {
  const router = useRouter()
  const [principal, setPrincipal] = useState(DEFAULT_PRINCIPAL)
  const [periodIdx, setPeriodIdx] = useState(0)

  const period = PERIODS[periodIdx]

  const results = useMemo(
    () =>
      PRODUCTS.map(p => ({
        ...p,
        earnings: calcEarnings(principal, p.rate, p.compound, period.days),
      })),
    [principal, period.days]
  )

  const epEarnings = results.find(r => r.id === 'ep')!.earnings
  const cdEarnings = results.find(r => r.id === 'cd')!.earnings
  const delta = epEarnings - cdEarnings

  return (
    <div className={styles.calcCard}>
      {/* ── Principal Slider ── */}
      <div className={styles.inputGroup}>
        <div className={styles.inputLabel}>
          <span>Investment Amount</span>
          <span className={styles.inputLabelValue}>{fmt(principal)}</span>
        </div>
        <input
          type="range"
          className={styles.slider}
          min={MIN_PRINCIPAL}
          max={MAX_PRINCIPAL}
          step={5_000}
          value={principal}
          onChange={e => setPrincipal(Number(e.target.value))}
          aria-label="Investment amount"
        />
        <div className={styles.sliderRange}>
          <span>{fmt(MIN_PRINCIPAL)}</span>
          <span>{fmt(MAX_PRINCIPAL)}</span>
        </div>
      </div>

      {/* ── Period Tabs ── */}
      <div className={styles.inputGroup}>
        <div className={styles.inputLabel}>
          <span>Time Period</span>
        </div>
        <div className={styles.tabs}>
          {PERIODS.map((p, i) => (
            <button
              key={p.label}
              className={`${styles.tab} ${i === periodIdx ? styles.tabActive : ''}`}
              onClick={() => setPeriodIdx(i)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Results ── */}
      <div className={styles.resultsTitle}>Projected Earnings — {period.label}</div>

      {results.map(r => (
        <div key={r.id} className={`${styles.resultRow} ${r.highlight ? styles.resultRowHighlight : ''}`}>
          <div className={r.highlight ? styles.resultNameHighlight : styles.resultName}>
            {r.highlight && '★ '}
            {r.label}
          </div>
          <div className={`${styles.resultRate} ${r.highlight ? styles.resultRateHighlight : ''}`}>{r.rateLabel}</div>
          <div className={styles.resultAmount}>
            <span className={`${styles.resultAmountValue} ${r.highlight ? styles.resultAmountHighlight : ''}`}>
              {fmt(r.earnings)}
            </span>
            <span className={styles.resultAmountLabel}>interest earned</span>
          </div>
        </div>
      ))}

      {/* ── Delta ── */}
      {delta > 0 && (
        <div className={styles.deltaRow}>
          <span>EarnPrime earns</span>
          <span className={styles.deltaAmount}>{fmt(delta)}</span>
          <span>more than a Bank CD over {period.label}</span>
        </div>
      )}

      {/* ── CTA ── */}
      <div className={styles.ctaSection}>
        <p className={styles.ctaText}>
          Put your money to work at <strong>6.75% APY</strong> — fixed for 270 days.
        </p>
        <EPButton size="lg" onClick={() => router.push('/register')}>
          Get Started with EarnPrime Notes
        </EPButton>
        <p className={styles.ctaDisclaimer}>$25,000 minimum · No fees · Fixed rate · Auto-renews at maturity</p>
      </div>
    </div>
  )
}
