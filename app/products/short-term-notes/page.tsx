import type { Metadata } from 'next'
import Link from 'next/link'
import EPContainer from '@/components/layout/EPContainer'
import NavHeader from '@/components/layout/NavHeader'
import styles from '@/components/products/products.module.css'

export const metadata: Metadata = {
  title: 'Short Term Notes — 6.75% APY Fixed Rate | EarnPrime',
  description:
    'EarnPrime Short Term Notes pay 6.75% APY, fixed for 270 days, compounded daily. No fees, automatic renewal at the Prime Rate. $25,000 minimum for accredited investors.',
  keywords:
    'short term notes, 6.75% APY, fixed rate investment, high yield note, EarnPrime notes, alternative to bank CD, accredited investor, 270 day note',
  openGraph: {
    title: 'Short Term Notes — 6.75% APY Fixed Rate | EarnPrime',
    description:
      'Earn 6.75% APY fixed for 270 days with daily compounding. No fees. Auto-renewal at the Prime Rate.',
    type: 'website',
  },
}

export default function ShortTermNotesPage() {
  return (
    <div className={styles.page}>
      <NavHeader />

      {/* Hero */}
      <section className={styles.hero}>
        <EPContainer maxWidth="lg">
          <h1 className={styles.heroTitle}>
            Short Term{' '}
            <span className={styles.heroTitleAccent}>Notes</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Trade in your bank CDs for EarnPrime Short Term Notes — earn 6.75% APY, fixed for 270
            days, with daily compounding and zero fees.
          </p>

          {/* Product type nav */}
          <nav className={styles.productTypeNav} aria-label="Product type">
            <span className={`${styles.productTypeLink} ${styles.productTypeLinkActive}`}>
              Short Term Notes
            </span>
            <Link href="/products/preferred-equity" className={styles.productTypeLink}>
              Preferred Equity
            </Link>
          </nav>
        </EPContainer>
      </section>

      {/* Product Details */}
      <EPContainer maxWidth="md">
        <div className={styles.productCard}>
          {/* Key stats */}
          <div className={styles.highlightRow}>
            <div className={`${styles.highlightItem} ${styles.highlightItemAccent}`}>
              <div className={styles.highlightLabel}>Yield</div>
              <div className={`${styles.highlightValue} ${styles.highlightValueAccent}`}>6.75%</div>
              <div className={styles.highlightSub}>APY, fixed rate</div>
            </div>
            <div className={styles.highlightItem}>
              <div className={styles.highlightLabel}>Term</div>
              <div className={styles.highlightValue}>270 days</div>
              <div className={styles.highlightSub}>~9 months</div>
            </div>
            <div className={styles.highlightItem}>
              <div className={styles.highlightLabel}>Minimum</div>
              <div className={styles.highlightValue}>$25,000</div>
              <div className={styles.highlightSub}>Accredited investors</div>
            </div>
          </div>

          {/* Available denominations */}
          <div className={styles.highlightLabel} style={{ marginBottom: '0.5rem' }}>
            Available Denominations
          </div>
          <div className={styles.denominations}>
            <div className={styles.denomination}>$25,000</div>
            <div className={styles.denomination}>$50,000</div>
            <div className={styles.denomination}>$75,000</div>
            <div className={styles.denomination}>$100,000</div>
          </div>

          {/* Features */}
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>Fixed rate for the term of the note</strong> — just like a bank CD, your
                rate is locked in at 6.75% APY for the full 270-day term.
              </span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>Daily compound interest</strong> — interest accrues and compounds daily, then
                is paid out at maturity. This allows you to earn +0.2% more per year compared to
                monthly compounding.
              </span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>Automatic renewal</strong> — at maturity, notes auto-renew at the Prime Rate
                (Federal Funds rate + 3.0%) so your money keeps compounding.
              </span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>Withdrawal at maturity</strong> — available with 30 days notice. No penalty.
              </span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>Early withdrawal</strong> — available with 30 days notice, but will forfeit
                the last 90 days worth of interest earned.
              </span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>Tax-friendly</strong> — 1099 tax forms provided.
              </span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>No fees, ever</strong> — keep 100% of the interest earned.
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className={styles.ctaSection}>
            <p className={styles.ctaText}>
              Ready to earn 6.75% APY on your savings?
            </p>
            <Link
              href="/register"
              style={{
                display: 'inline-block',
                background: 'var(--color-primary-green)',
                color: '#000',
                padding: '0.75rem 2rem',
                borderRadius: '9999px',
                fontSize: '1rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Buy Short Term Notes
            </Link>
            <p className={styles.ctaDisclaimer}>
              EarnPrime Short Term Notes are not FDIC insured and are intended for accredited
              investors.
            </p>
          </div>
        </div>
      </EPContainer>

      {/* Info Section */}
      <section className={styles.infoSection}>
        <EPContainer maxWidth="md">
          <h2 className={styles.infoSectionTitle}>How Short Term Notes Compare</h2>
          <p className={styles.infoSectionText}>
            EarnPrime Short Term Notes are designed to be a better alternative to bank CDs, money
            market accounts, and fixed annuities — offering a higher fixed rate with a shorter
            lock-up period.
          </p>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>vs. Bank CDs</h3>
              <p className={styles.infoCardText}>
                The average 1-year bank CD pays around 4.00% APY. EarnPrime Notes pay 6.75% APY —
                2.75% more — with a shorter 9-month term instead of 12 months.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>vs. Money Market</h3>
              <p className={styles.infoCardText}>
                High-yield savings and money market accounts average around 3.50% APY with variable
                rates that can drop at any time. EarnPrime locks in 6.75% for the full term.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>vs. Fixed Annuities</h3>
              <p className={styles.infoCardText}>
                Fixed-rate annuities offer around 6.50% APY but require 5+ year lock-ups.
                EarnPrime&apos;s 9-month term gives you flexibility with a comparable rate.
              </p>
            </div>
          </div>
        </EPContainer>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <EPContainer maxWidth="md">
          <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Who can invest in Short Term Notes?</h3>
            <p className={styles.faqAnswer}>
              EarnPrime Short Term Notes are intended for accredited investors. The minimum
              investment is $25,000, with notes available in $25,000, $50,000, $75,000, and $100,000
              increments or any combination thereof.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>How is the 6.75% APY rate determined?</h3>
            <p className={styles.faqAnswer}>
              EarnPrime invests pooled capital into SEC-regulated mutual funds of diversified
              corporate loans with investment-grade credit ratings. Higher base yields from these
              funds, combined with lower default rates and lower internal expenses, allow EarnPrime
              to pass a 6.75% fixed rate to investors.{' '}
              <Link href="/how-it-works">Learn more about how it works.</Link>
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>What happens at the end of the 270-day term?</h3>
            <p className={styles.faqAnswer}>
              Notes automatically renew at the Prime Rate (Federal Funds rate + 3.0%) so your
              returns keep compounding. You can withdraw at maturity with 30 days&apos; notice and no
              penalty.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Can I withdraw early?</h3>
            <p className={styles.faqAnswer}>
              Yes — early withdrawal is available with 30 days&apos; notice. However, early
              withdrawal will forfeit the last 90 days&apos; worth of interest earned.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Are there any fees?</h3>
            <p className={styles.faqAnswer}>
              No. EarnPrime charges zero fees on Short Term Notes. You keep 100% of the interest
              earned.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Are Short Term Notes FDIC insured?</h3>
            <p className={styles.faqAnswer}>
              No — EarnPrime Short Term Notes are not FDIC insured. However, pooled capital is
              invested in SEC-regulated mutual funds with investment-grade credit ratings
              (&quot;A&quot; and &quot;AA&quot; as of Q4-2025).
            </p>
          </div>
        </EPContainer>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <EPContainer maxWidth="xl">
          <div className={styles.footerLinks}>
            <Link href="/">Home</Link>
            <Link href="/products/preferred-equity">Preferred Equity</Link>
            <Link href="/calculator">Investment Calculator</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} EarnPrime. All rights reserved. EarnPrime Short Term Notes
            are not FDIC insured and are intended for accredited investors. Past performance does not
            guarantee future results.
          </p>
        </EPContainer>
      </footer>
    </div>
  )
}
