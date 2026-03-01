import type { Metadata } from 'next'
import Link from 'next/link'
import EPContainer from '@/components/layout/EPContainer'
import NavHeader from '@/components/layout/NavHeader'
import InvestmentCalculator from '@/components/calculator/InvestmentCalculator'
import styles from '@/components/calculator/calculator.module.css'

export const metadata: Metadata = {
  title: 'Investment Returns Calculator | Compare CD Rates vs EarnPrime Notes',
  description:
    'Free investment calculator: compare returns from bank CDs, money market accounts, fixed annuities, and EarnPrime Short Term Notes at 6.75% APY. See how much more you could earn.',
  keywords:
    'investment calculator, CD rate calculator, compare investment returns, high yield CD calculator, short term investment calculator, CD vs money market, 6.75% APY calculator',
  openGraph: {
    title: 'Investment Returns Calculator | EarnPrime',
    description:
      'Compare your investment returns across CDs, money market accounts, and EarnPrime Notes earning 6.75% APY.',
    type: 'website',
  },
}

export default function InvestmentCalculatorPage() {
  return (
    <div className={styles.page}>
      <NavHeader />

      {/* Hero */}
      <section className={styles.hero}>
        <EPContainer maxWidth="lg">
          <h1 className={styles.heroTitle}>
            Investment Returns{' '}
            <span className={styles.heroTitleAccent}>Calculator</span>
          </h1>
          <p className={styles.heroSubtitle}>
            See exactly how much your money earns across different investment products — Bank CDs,
            Money Market accounts, Fixed Annuities, and EarnPrime Short Term Notes.
          </p>

          {/* Calculator type nav */}
          <nav className={styles.calcTypeNav} aria-label="Calculator type">
            <span className={`${styles.calcTypeLink} ${styles.calcTypeLinkActive}`}>
              Investment Returns
            </span>
            <Link href="/calculator/mortgage" className={styles.calcTypeLink}>
              Mortgage Calculator
            </Link>
            <Link href="/calculator/loan" className={styles.calcTypeLink}>
              Loan Calculator
            </Link>
          </nav>
        </EPContainer>
      </section>

      {/* Calculator */}
      <EPContainer maxWidth="md">
        <InvestmentCalculator />
      </EPContainer>

      {/* SEO Content */}
      <section className={styles.seoSection}>
        <EPContainer maxWidth="md">
          <h2 className={styles.seoSectionTitle}>How to Compare Investment Returns</h2>
          <p className={styles.seoSectionText}>
            When comparing short-term investment options, the annual percentage yield (APY) tells
            you the effective rate of return including compounding. However, the term length and
            compounding frequency both matter — a 6.75% APY compounded daily over 9 months produces
            a different result than 6.75% compounded annually.
          </p>

          <div className={styles.seoGrid}>
            <div className={styles.seoCard}>
              <h3 className={styles.seoCardTitle}>Money Market &amp; HYSA</h3>
              <p className={styles.seoCardText}>
                High-yield savings accounts and money market accounts offer variable rates, currently
                averaging around 3.50% APY. They&apos;re liquid with no lock-up, but rates can drop
                at any time and are subject to the Federal Funds rate.
              </p>
            </div>
            <div className={styles.seoCard}>
              <h3 className={styles.seoCardTitle}>Bank CDs</h3>
              <p className={styles.seoCardText}>
                Certificates of Deposit lock your money for a fixed term (usually 12–60 months) in
                exchange for a fixed rate — currently around 4.00% APY for 1-year CDs. Early
                withdrawal typically incurs a penalty of 3–6 months of interest.
              </p>
            </div>
            <div className={styles.seoCard}>
              <h3 className={styles.seoCardTitle}>EarnPrime Short Term Notes</h3>
              <p className={styles.seoCardText}>
                EarnPrime Notes pay 6.75% APY, fixed for 270 days, compounded daily. At maturity
                they auto-renew at the Prime Rate. No fees means you keep 100% of interest earned —
                significantly more than a bank CD on the same principal.
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
              How does this investment calculator work?
            </h3>
            <p className={styles.faqAnswer}>
              Enter your investment amount and choose a time period. The calculator uses daily
              compounding for Money Market, Bank CD, and EarnPrime Notes, and annual compounding for
              Fixed Annuities — matching how each product actually compounds in practice.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              What is EarnPrime&apos;s 6.75% APY based on?
            </h3>
            <p className={styles.faqAnswer}>
              EarnPrime invests pooled capital into SEC-regulated mutual funds of diversified
              corporate loans with investment-grade credit ratings. The higher base yields from these
              funds, combined with lower default rates and low internal expenses, allow EarnPrime to
              pass a 6.75% fixed rate to investors — well above the 1-year bank CD average.{' '}
              <Link href="/how-it-works">Learn more about how it works.</Link>
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              Is there a minimum investment for EarnPrime Notes?
            </h3>
            <p className={styles.faqAnswer}>
              Yes — the minimum denomination is $25,000. Notes are available in $25,000, $50,000,
              $75,000, and $100,000 increments (or any combination). EarnPrime Notes are intended
              for accredited investors.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              What happens at the end of the 9-month term?
            </h3>
            <p className={styles.faqAnswer}>
              Notes auto-renew at the Prime Rate (Federal Funds rate + 3.0%) to allow for continued
              compounding. You can withdraw at maturity with 30 days&apos; notice, at no penalty.
              Early withdrawal is available with 30 days&apos; notice but forfeits the last 90
              days&apos; worth of interest.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              How do CD rates compare to EarnPrime Notes?
            </h3>
            <p className={styles.faqAnswer}>
              The national average 1-year CD rate is currently around 4.00% APY. EarnPrime Notes
              pay 6.75% APY — a difference of 2.75 percentage points. On a $100,000 investment over
              9 months, that translates to roughly $1,800 more in interest earned with EarnPrime vs.
              a Bank CD.
            </p>
          </div>
        </EPContainer>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <EPContainer maxWidth="xl">
          <div className={styles.footerLinks}>
            <Link href="/">Home</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/calculator/mortgage">Mortgage Calculator</Link>
            <Link href="/calculator/loan">Loan Calculator</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} EarnPrime. Rates shown are for illustrative purposes only
            and are not a guarantee of future returns. EarnPrime Short Term Notes are not FDIC
            insured. Past performance does not guarantee future results.
          </p>
        </EPContainer>
      </footer>
    </div>
  )
}
