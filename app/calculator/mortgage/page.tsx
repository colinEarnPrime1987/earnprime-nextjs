import type { Metadata } from 'next'
import Link from 'next/link'
import EPContainer from '@/components/layout/EPContainer'
import NavHeader from '@/components/layout/NavHeader'
import MortgageCalculator from '@/components/calculator/MortgageCalculator'
import styles from '@/components/calculator/calculator.module.css'

export const metadata: Metadata = {
  title: 'Mortgage Calculator | Monthly Payment & Amortization | Free Tool',
  description:
    'Free mortgage calculator: estimate your monthly payment, total interest, and amortization for any home price, down payment, and interest rate. 15, 20, and 30-year terms.',
  keywords:
    'mortgage calculator, monthly mortgage payment, home loan calculator, amortization calculator, mortgage payment estimator, how much house can I afford, 30 year mortgage calculator',
  openGraph: {
    title: 'Free Mortgage Calculator | Monthly Payment & Total Cost',
    description:
      'Calculate your monthly mortgage payment, total interest cost, and see a full breakdown for any home price and interest rate.',
    type: 'website',
  },
}

export default function MortgageCalculatorPage() {
  return (
    <div className={styles.page}>
      <NavHeader />

      {/* Hero */}
      <section className={styles.hero}>
        <EPContainer maxWidth="lg">
          <h1 className={styles.heroTitle}>
            Mortgage{' '}
            <span className={styles.heroTitleAccent}>Calculator</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Estimate your monthly mortgage payment, total interest paid, and the true cost of your
            home loan. Adjust the home price, down payment, rate, and term in real time.
          </p>

          {/* Calculator type nav */}
          <nav className={styles.calcTypeNav} aria-label="Calculator type">
            <Link href="/calculator" className={styles.calcTypeLink}>
              Investment Returns
            </Link>
            <span className={`${styles.calcTypeLink} ${styles.calcTypeLinkActive}`}>
              Mortgage Calculator
            </span>
            <Link href="/calculator/loan" className={styles.calcTypeLink}>
              Loan Calculator
            </Link>
          </nav>
        </EPContainer>
      </section>

      {/* Calculator */}
      <EPContainer maxWidth="md">
        <MortgageCalculator />
      </EPContainer>

      {/* SEO Content */}
      <section className={styles.seoSection}>
        <EPContainer maxWidth="md">
          <h2 className={styles.seoSectionTitle}>How to Calculate Your Mortgage Payment</h2>
          <p className={styles.seoSectionText}>
            Your monthly mortgage payment depends on four key variables: the loan amount (home price
            minus down payment), the annual interest rate, the loan term, and how often interest
            compounds. Most US mortgages use monthly compounding and are fully amortizing, meaning
            each payment covers both principal and interest until the loan is paid off.
          </p>
          <p className={styles.seoSectionText}>
            The standard formula for a fixed-rate monthly payment is:{' '}
            <em>M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]</em>, where P is the loan principal, r is the
            monthly interest rate, and n is the total number of payments.
          </p>

          <div className={styles.seoGrid}>
            <div className={styles.seoCard}>
              <h3 className={styles.seoCardTitle}>30-Year vs. 15-Year Mortgage</h3>
              <p className={styles.seoCardText}>
                A 30-year mortgage has lower monthly payments but you pay significantly more in total
                interest. A 15-year mortgage costs more each month but you build equity faster and
                pay roughly half the total interest over the life of the loan.
              </p>
            </div>
            <div className={styles.seoCard}>
              <h3 className={styles.seoCardTitle}>Down Payment Impact</h3>
              <p className={styles.seoCardText}>
                A larger down payment reduces your loan amount, lowers your monthly payment, and can
                eliminate the need for private mortgage insurance (PMI) — typically required when
                the down payment is less than 20% of the home price.
              </p>
            </div>
            <div className={styles.seoCard}>
              <h3 className={styles.seoCardTitle}>Rate &amp; Timing</h3>
              <p className={styles.seoCardText}>
                Even a 0.5% difference in your mortgage rate can translate to tens of thousands of
                dollars over a 30-year term. While waiting for a better rate, putting your savings
                to work at 6.75% APY with EarnPrime can add meaningful interest income.
              </p>
            </div>
          </div>
        </EPContainer>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <EPContainer maxWidth="md">
          <h2 className={styles.faqTitle}>Mortgage Calculator FAQ</h2>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              Does this calculator include taxes and insurance?
            </h3>
            <p className={styles.faqAnswer}>
              No — this calculator shows your principal and interest (P&amp;I) payment only. Your
              actual monthly payment to a lender will typically also include property taxes,
              homeowner&apos;s insurance, and potentially PMI, which are usually escrowed and bundled
              into your payment.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              How much house can I afford?
            </h3>
            <p className={styles.faqAnswer}>
              A common rule of thumb is that housing costs (mortgage payment + taxes + insurance)
              should not exceed 28% of your gross monthly income. Your debt-to-income ratio
              (including all debts) should ideally be below 36%. Lenders typically use these
              thresholds to qualify buyers.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              What is amortization?
            </h3>
            <p className={styles.faqAnswer}>
              Amortization is the process of paying off a loan through regular payments over time.
              In a fully amortizing mortgage, early payments are primarily interest, while later
              payments shift toward more principal. By the end of the loan term, the full balance is
              paid off.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              Should I put more than 20% down?
            </h3>
            <p className={styles.faqAnswer}>
              Putting 20% down avoids PMI and reduces your monthly payment. However, a larger down
              payment ties up cash that could be earning returns elsewhere. For example, parking your
              down payment in EarnPrime Notes at 6.75% APY while finalizing your purchase could
              generate meaningful interest income. Use the investment calculator above to see the
              comparison.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              Can I pay off my mortgage early?
            </h3>
            <p className={styles.faqAnswer}>
              Most conventional mortgages in the US allow extra principal payments without penalty.
              Making one extra payment per year, or rounding up your monthly payment, can shave
              years off your loan and save tens of thousands in interest. Consult your loan
              agreement or lender to confirm prepayment terms.
            </p>
          </div>
        </EPContainer>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <EPContainer maxWidth="xl">
          <div className={styles.footerLinks}>
            <Link href="/">Home</Link>
            <Link href="/calculator">Investment Calculator</Link>
            <Link href="/calculator/loan">Loan Calculator</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} EarnPrime. This calculator is for illustrative purposes
            only and does not constitute financial advice. Consult a qualified mortgage lender for
            personalized guidance. EarnPrime Short Term Notes are not FDIC insured.
          </p>
        </EPContainer>
      </footer>
    </div>
  )
}
