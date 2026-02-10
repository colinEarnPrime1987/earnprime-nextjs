'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import styles from './brokerage-agreement.module.css'

export default function BrokerageAgreementPage() {
  const router = useRouter()

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <EPContainer maxWidth="xl">
          <div className={styles.headerContent}>
            <img
              src="/assets/Logo files/PNGs - SVGs/SVG/Asset 3.svg"
              alt="EarnPrime Logo"
              className={styles.logo}
              onClick={() => router.push('/')}
              style={{ cursor: 'pointer' }}
            />
            <EPButton size="sm" onClick={() => router.push('/register')}>
              Get Started
            </EPButton>
          </div>
        </EPContainer>
      </header>

      <section className={styles.hero}>
        <EPContainer maxWidth="lg">
          <h1 className={styles.heroTitle}>Limited Brokerage Services Agreement</h1>
          <p className={styles.heroSubtitle}>Last Updated: {new Date().toLocaleDateString()}</p>
        </EPContainer>
      </section>

      <section className={styles.content}>
        <EPContainer maxWidth="lg">
          <div className={styles.legalContent}>
            <div className={styles.section}>
              <h2>1. Introduction</h2>
              <p>
                This Limited Brokerage Services Agreement (&quot;Agreement&quot;) is entered into between you (&quot;Client&quot;) and
                EarnPrime Securities, LLC (&quot;EarnPrime,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;), a registered broker-dealer and member
                of FINRA and SIPC. This Agreement governs the terms and conditions of your brokerage account and the
                services we provide.
              </p>
            </div>

            <div className={styles.section}>
              <h2>2. Account Opening and Eligibility</h2>
              <p>
                To open an account with EarnPrime, you must be at least 18 years of age, a U.S. citizen or permanent
                resident, and provide all required identification and financial information. We reserve the right to
                approve or deny any account application at our sole discretion.
              </p>
              <ul>
                <li>You must provide accurate, current, and complete information during registration</li>
                <li>You agree to update your information promptly if it changes</li>
                <li>We may verify your identity through third-party services</li>
                <li>We may request additional documentation to comply with regulatory requirements</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>3. Services Provided</h2>
              <p>
                EarnPrime provides limited brokerage services, including the ability to buy and sell securities through
                our platform. Our services include:
              </p>
              <ul>
                <li>Self-directed brokerage accounts for trading equities and ETFs</li>
                <li>Access to research and market data</li>
                <li>Account management tools and portfolio tracking</li>
                <li>Electronic trade confirmations and account statements</li>
              </ul>
              <p>
                EarnPrime does not provide investment advice, tax advice, or financial planning services. All investment
                decisions are made solely by you, and you are responsible for evaluating the suitability of any investment.
              </p>
            </div>

            <div className={styles.section}>
              <h2>4. Fees and Commissions</h2>
              <p>
                You agree to pay all applicable fees and commissions as described in our Fee Schedule, which is
                incorporated by reference into this Agreement. We reserve the right to modify our fees with 30 days&apos;
                prior notice. Current fees include:
              </p>
              <ul>
                <li>Commission-free trading on U.S.-listed equities and ETFs</li>
                <li>Regulatory fees as required by FINRA and the SEC</li>
                <li>Account maintenance fees (if applicable)</li>
                <li>Wire transfer and other miscellaneous fees as outlined in the Fee Schedule</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>5. Risks of Investing</h2>
              <p>
                Investing in securities involves risk, including the possible loss of principal. Past performance does
                not guarantee future results. You acknowledge that you understand the risks associated with investing
                and that you are solely responsible for your investment decisions.
              </p>
            </div>

            <div className={styles.section}>
              <h2>6. Account Security</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. You agree to notify
                us immediately of any unauthorized use of your account. EarnPrime is not liable for losses resulting
                from unauthorized access to your account due to your failure to safeguard your credentials.
              </p>
            </div>

            <div className={styles.section}>
              <h2>7. Arbitration</h2>
              <p>
                Any disputes arising from this Agreement or your account shall be resolved through binding arbitration
                administered by FINRA in accordance with its arbitration rules. By agreeing to arbitration, you waive
                your right to a jury trial and to participate in a class action lawsuit.
              </p>
            </div>

            <div className={styles.section}>
              <h2>8. SIPC Protection</h2>
              <p>
                EarnPrime is a member of the Securities Investor Protection Corporation (SIPC). SIPC protects the
                securities and cash in your brokerage account up to $500,000 (including up to $250,000 for cash).
                SIPC does not protect against market losses. For more information, visit www.sipc.org.
              </p>
            </div>

            <div className={styles.section}>
              <h2>9. Contact Us</h2>
              <p>If you have questions about this Agreement, please contact us:</p>
              <ul>
                <li>Email: compliance@earnprime.com</li>
                <li>Phone: 1-800-EARN-PRIME</li>
                <li>Mail: 123 Financial District, New York, NY 10004</li>
              </ul>
            </div>
          </div>
        </EPContainer>
      </section>

      <footer className={styles.footer}>
        <EPContainer maxWidth="xl">
          <p className={styles.footerText}>&copy; {new Date().getFullYear()} EarnPrime. All rights reserved.</p>
        </EPContainer>
      </footer>
    </div>
  )
}
