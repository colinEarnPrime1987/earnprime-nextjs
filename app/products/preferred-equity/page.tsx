import type { Metadata } from 'next'
import Link from 'next/link'
import EPContainer from '@/components/layout/EPContainer'
import NavHeader from '@/components/layout/NavHeader'
import styles from '@/components/products/products.module.css'

export const metadata: Metadata = {
  title: 'Preferred Equity — Stable Returns with Priority Payouts | EarnPrime',
  description:
    'EarnPrime Preferred Equity offers stable, priority returns backed by diversified real asset portfolios. Designed for accredited investors seeking consistent income with downside protection.',
  keywords:
    'preferred equity, preferred equity investment, priority returns, stable income investment, EarnPrime preferred equity, accredited investor, alternative investment',
  openGraph: {
    title: 'Preferred Equity — Stable Returns with Priority Payouts | EarnPrime',
    description:
      'Earn stable, priority returns backed by diversified real asset portfolios. Designed for accredited investors.',
    type: 'website',
  },
}

export default function PreferredEquityPage() {
  return (
    <div className={styles.page}>
      <NavHeader />

      {/* Hero */}
      <section className={styles.hero}>
        <EPContainer maxWidth="lg">
          <h1 className={styles.heroTitle}>
            Preferred{' '}
            <span className={styles.heroTitleAccent}>Equity</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Priority returns backed by diversified real asset portfolios — stable income with
            downside protection for accredited investors.
          </p>

          {/* Product type nav */}
          <nav className={styles.productTypeNav} aria-label="Product type">
            <Link href="/products/short-term-notes" className={styles.productTypeLink}>
              Short Term Notes
            </Link>
            <span className={`${styles.productTypeLink} ${styles.productTypeLinkActive}`}>
              Preferred Equity
            </span>
          </nav>
        </EPContainer>
      </section>

      {/* Product Details */}
      <EPContainer maxWidth="md">
        <div className={styles.productCard}>
          {/* Key stats */}
          <div className={styles.highlightRow}>
            <div className={`${styles.highlightItem} ${styles.highlightItemAccent}`}>
              <div className={styles.highlightLabel}>Target Return</div>
              <div className={`${styles.highlightValue} ${styles.highlightValueAccent}`}>8–10%</div>
              <div className={styles.highlightSub}>Annual target yield</div>
            </div>
            <div className={styles.highlightItem}>
              <div className={styles.highlightLabel}>Distribution</div>
              <div className={styles.highlightValue}>Quarterly</div>
              <div className={styles.highlightSub}>Paid to investors</div>
            </div>
            <div className={styles.highlightItem}>
              <div className={styles.highlightLabel}>Minimum</div>
              <div className={styles.highlightValue}>$50,000</div>
              <div className={styles.highlightSub}>Accredited investors</div>
            </div>
          </div>

          {/* Features */}
          <div className={styles.featureList}>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>Priority payouts</strong> — preferred equity holders receive distributions
                before common equity holders, providing an added layer of downside protection.
              </span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>Diversified backing</strong> — returns are supported by a diversified
                portfolio of real assets, reducing concentration risk.
              </span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>Quarterly distributions</strong> — receive income on a quarterly schedule,
                providing regular cash flow.
              </span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>Professional management</strong> — portfolios are managed by experienced
                teams with long track records of strong underwriting and low losses.
              </span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>Tax-efficient structure</strong> — designed to optimize tax treatment for
                investors. K-1 tax documentation provided.
              </span>
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureIcon}>&#10003;</span>
              <span>
                <strong>No management fees</strong> — EarnPrime does not charge management fees on
                preferred equity investments.
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className={styles.ctaSection}>
            <p className={styles.ctaText}>
              Interested in stable, priority returns?
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
              Invest in Preferred Equity
            </Link>
            <p className={styles.ctaDisclaimer}>
              EarnPrime Preferred Equity is not FDIC insured and is intended for accredited
              investors. Target returns are not guaranteed.
            </p>
          </div>
        </div>
      </EPContainer>

      {/* Info Section */}
      <section className={styles.infoSection}>
        <EPContainer maxWidth="md">
          <h2 className={styles.infoSectionTitle}>Why Preferred Equity?</h2>
          <p className={styles.infoSectionText}>
            Preferred equity sits between debt and common equity in the capital structure — offering
            higher potential returns than fixed-income products while providing priority claim on
            assets and cash flows ahead of common equity holders.
          </p>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Priority Position</h3>
              <p className={styles.infoCardText}>
                In the capital stack, preferred equity holders are paid before common equity holders.
                This means you receive your distributions first, providing a cushion against
                downside scenarios.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Income Focused</h3>
              <p className={styles.infoCardText}>
                Designed for investors who prioritize regular income over speculative growth.
                Quarterly distributions provide predictable cash flow to supplement your portfolio.
              </p>
            </div>
            <div className={styles.infoCard}>
              <h3 className={styles.infoCardTitle}>Diversification</h3>
              <p className={styles.infoCardText}>
                Adding preferred equity to a portfolio of stocks, bonds, and cash can improve
                risk-adjusted returns by introducing an asset class with low correlation to public
                markets.
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
            <h3 className={styles.faqQuestion}>
              What is the difference between preferred equity and Short Term Notes?
            </h3>
            <p className={styles.faqAnswer}>
              Short Term Notes are fixed-rate debt instruments with a guaranteed 6.75% APY for 270
              days. Preferred equity targets 8–10% annual returns with quarterly distributions but
              returns are not guaranteed — they depend on the performance of the underlying
              portfolio. Preferred equity has a longer investment horizon and higher return potential
              with correspondingly more risk.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Who can invest in Preferred Equity?</h3>
            <p className={styles.faqAnswer}>
              EarnPrime Preferred Equity is available to accredited investors with a minimum
              investment of $50,000. Accredited investor status is verified during the account
              registration process.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>How are returns distributed?</h3>
            <p className={styles.faqAnswer}>
              Distributions are paid quarterly and deposited directly into your EarnPrime wallet. You
              can reinvest distributions or withdraw them to your linked bank account.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Can I redeem my investment early?</h3>
            <p className={styles.faqAnswer}>
              Preferred equity has a recommended minimum holding period. Early redemption requests are
              considered on a case-by-case basis and may be subject to certain conditions. Contact
              our team for details.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>Is Preferred Equity FDIC insured?</h3>
            <p className={styles.faqAnswer}>
              No — EarnPrime Preferred Equity is not FDIC insured. Target returns are not guaranteed
              and depend on portfolio performance. However, the preferred position in the capital
              stack provides a layer of protection ahead of common equity holders.
            </p>
          </div>
        </EPContainer>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <EPContainer maxWidth="xl">
          <div className={styles.footerLinks}>
            <Link href="/">Home</Link>
            <Link href="/products/short-term-notes">Short Term Notes</Link>
            <Link href="/calculator">Investment Calculator</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} EarnPrime. All rights reserved. EarnPrime Preferred Equity
            is not FDIC insured. Target returns are not guaranteed and are intended for accredited
            investors. Past performance does not guarantee future results.
          </p>
        </EPContainer>
      </footer>
    </div>
  )
}
