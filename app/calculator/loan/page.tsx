import type { Metadata } from 'next'
import Link from 'next/link'
import EPContainer from '@/components/layout/EPContainer'
import NavHeader from '@/components/layout/NavHeader'
import LoanCalculator from '@/components/calculator/LoanCalculator'
import styles from '@/components/calculator/calculator.module.css'

export const metadata: Metadata = {
  title: 'Loan Calculator | Monthly Payment & Total Interest | Free Tool',
  description:
    'Free loan calculator for personal loans, auto loans, student loans, and business loans. Calculate your monthly payment, total interest, and full repayment cost instantly.',
  keywords:
    'loan calculator, personal loan calculator, auto loan calculator, monthly loan payment, loan interest calculator, student loan calculator, business loan calculator, loan repayment calculator',
  openGraph: {
    title: 'Free Loan Calculator | Monthly Payment & Total Interest',
    description:
      'Calculate monthly payments and total interest for any loan type — personal, auto, student, or business. Adjust rate and term in real time.',
    type: 'website',
  },
}

export default function LoanCalculatorPage() {
  return (
    <div className={styles.page}>
      <NavHeader />

      {/* Hero */}
      <section className={styles.hero}>
        <EPContainer maxWidth="lg">
          <h1 className={styles.heroTitle}>
            Loan{' '}
            <span className={styles.heroTitleAccent}>Calculator</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Calculate your monthly payment and total interest for personal loans, auto loans,
            student loans, and business loans. Adjust the amount, rate, and term in real time.
          </p>

          {/* Calculator type nav */}
          <nav className={styles.calcTypeNav} aria-label="Calculator type">
            <Link href="/calculator" className={styles.calcTypeLink}>
              Investment Returns
            </Link>
            <Link href="/calculator/mortgage" className={styles.calcTypeLink}>
              Mortgage Calculator
            </Link>
            <span className={`${styles.calcTypeLink} ${styles.calcTypeLinkActive}`}>
              Loan Calculator
            </span>
          </nav>
        </EPContainer>
      </section>

      {/* Calculator */}
      <EPContainer maxWidth="md">
        <LoanCalculator />
      </EPContainer>

      {/* SEO Content */}
      <section className={styles.seoSection}>
        <EPContainer maxWidth="md">
          <h2 className={styles.seoSectionTitle}>How Loan Payments Are Calculated</h2>
          <p className={styles.seoSectionText}>
            Loan payments are calculated using the standard amortization formula. Your monthly
            payment stays constant, but the proportion of principal vs. interest changes over time —
            early payments are mostly interest, while later payments chip away more at principal.
            The total interest you pay depends on three things: the loan amount, the interest rate,
            and the loan term.
          </p>

          <div className={styles.seoGrid}>
            <div className={styles.seoCard}>
              <h3 className={styles.seoCardTitle}>Personal Loans</h3>
              <p className={styles.seoCardText}>
                Personal loans are unsecured, meaning no collateral is required. Rates typically
                range from 6% to 36% APR depending on creditworthiness. Terms usually run 2–7
                years. They&apos;re commonly used for debt consolidation, home improvements, or
                large purchases.
              </p>
            </div>
            <div className={styles.seoCard}>
              <h3 className={styles.seoCardTitle}>Auto Loans</h3>
              <p className={styles.seoCardText}>
                Auto loans are secured by the vehicle, allowing lenders to offer lower rates —
                typically 5–10% for qualified borrowers. Terms range from 24–84 months. Longer
                terms lower your payment but significantly increase total interest paid.
              </p>
            </div>
            <div className={styles.seoCard}>
              <h3 className={styles.seoCardTitle}>Lower Your Total Cost</h3>
              <p className={styles.seoCardText}>
                The best way to reduce loan costs is to borrow less by saving more beforehand.
                Growing your savings at 6.75% APY with EarnPrime Notes before a major purchase
                means you need to borrow less — which saves far more in interest than it costs.
              </p>
            </div>
          </div>
        </EPContainer>
      </section>

      {/* FAQ */}
      <section className={styles.faqSection}>
        <EPContainer maxWidth="md">
          <h2 className={styles.faqTitle}>Loan Calculator FAQ</h2>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              What is APR vs. interest rate?
            </h3>
            <p className={styles.faqAnswer}>
              The interest rate is the base cost of borrowing. APR (Annual Percentage Rate) includes
              the interest rate plus any fees (origination fees, closing costs, etc.), giving a more
              complete picture of the loan&apos;s true cost. Always compare APRs when shopping for
              loans.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              How does the loan term affect my payment?
            </h3>
            <p className={styles.faqAnswer}>
              A longer loan term means smaller monthly payments but more total interest paid. A
              shorter term means higher monthly payments but you pay off the loan faster and pay less
              in total interest. Use the calculator above to see the tradeoff for your specific
              situation.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              What credit score do I need for a personal loan?
            </h3>
            <p className={styles.faqAnswer}>
              Most lenders require a minimum credit score of 580–640 for a personal loan. The best
              rates (typically below 10% APR) are reserved for borrowers with scores above 720.
              Improving your credit score before applying can save significant money in interest
              over the life of the loan.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              Is it better to save up or take out a loan?
            </h3>
            <p className={styles.faqAnswer}>
              If the loan interest rate exceeds what you can earn on your savings, borrowing costs
              more. For example, a 10% personal loan costs far more than earning 6.75% APY. In
              many cases, saving up first — especially at a competitive rate like EarnPrime&apos;s
              6.75% APY — and borrowing less (or nothing) is the lower-cost strategy.
            </p>
          </div>

          <div className={styles.faqItem}>
            <h3 className={styles.faqQuestion}>
              Can I pay off a loan early to save on interest?
            </h3>
            <p className={styles.faqAnswer}>
              Yes — paying off a loan early reduces the total interest you pay because interest
              accrues on the outstanding balance. However, check your loan agreement for prepayment
              penalties, which some lenders charge to recoup lost interest income. Most personal
              loans and auto loans do not have prepayment penalties.
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
            <Link href="/calculator/mortgage">Mortgage Calculator</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
          <p className={styles.footerText}>
            © {new Date().getFullYear()} EarnPrime. This calculator is for illustrative purposes
            only and does not constitute financial advice. Consult a qualified lender or financial
            advisor for personalized guidance. EarnPrime Short Term Notes are not FDIC insured.
          </p>
        </EPContainer>
      </footer>
    </div>
  )
}
