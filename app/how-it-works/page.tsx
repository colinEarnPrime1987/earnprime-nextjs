'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import styles from './how-it-works.module.css'

export default function HowItWorksPage() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/register')
  }

  const handleBackHome = () => {
    router.push('/')
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <EPContainer maxWidth="xl">
          <div className={styles.headerContent}>
            <img
              src="/assets/Logo files/PNGs - SVGs/SVG/Asset 3.svg"
              alt="EarnPrime Logo"
              className={styles.logo}
              onClick={handleBackHome}
              style={{ cursor: 'pointer' }}
            />
            <EPButton size="sm" onClick={handleGetStarted}>
              Get Started
            </EPButton>
          </div>
        </EPContainer>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <EPContainer maxWidth="lg">
          <h1 className={styles.heroTitle}>How EarnPrime Works</h1>
          <p className={styles.heroSubtitle}>
            Start investing in short-term notes in four simple steps. Secure, transparent, and designed for growth.
          </p>
        </EPContainer>
      </section>

      {/* Steps Section */}
      <section className={styles.steps}>
        <EPContainer maxWidth="lg">
          <div className={styles.stepsGrid}>
            {/* Step 1 */}
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <h3 className={styles.stepTitle}>Create Your Account</h3>
              <p className={styles.stepDescription}>
                Sign up in minutes with our streamlined registration process. We collect essential information to verify your identity and ensure platform security.
              </p>
              <ul className={styles.stepList}>
                <li>Provide basic personal information</li>
                <li>Complete KYC verification</li>
                <li>Set up secure authentication</li>
              </ul>
            </div>

            {/* Step 2 */}
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <h3 className={styles.stepTitle}>Fund Your Wallet</h3>
              <p className={styles.stepDescription}>
                Add funds to your EarnPrime wallet using secure payment methods. Your capital is protected and ready to deploy when opportunities arise.
              </p>
              <ul className={styles.stepList}>
                <li>Link your bank account</li>
                <li>Transfer funds securely</li>
                <li>Monitor your available balance</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <h3 className={styles.stepTitle}>Choose Investment Notes</h3>
              <p className={styles.stepDescription}>
                Browse available short-term investment notes with transparent terms, expected returns, and risk ratings. Select investments that match your goals.
              </p>
              <ul className={styles.stepList}>
                <li>Review note details and terms</li>
                <li>Assess risk and return profiles</li>
                <li>Invest with a single click</li>
              </ul>
            </div>

            {/* Step 4 */}
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <h3 className={styles.stepTitle}>Earn & Withdraw</h3>
              <p className={styles.stepDescription}>
                Watch your investments grow and receive returns upon note maturity. Withdraw funds to your bank account or reinvest for compound growth.
              </p>
              <ul className={styles.stepList}>
                <li>Track performance in real-time</li>
                <li>Receive automatic payouts</li>
                <li>Withdraw or reinvest earnings</li>
              </ul>
            </div>
          </div>
        </EPContainer>
      </section>

      {/* Security Section */}
      <section className={styles.security}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.sectionTitle}>Built on Trust & Security</h2>
          <div className={styles.securityGrid}>
            <div className={styles.securityItem}>
              <h3>🔒 Bank-Level Encryption</h3>
              <p>Your data and transactions are protected with 256-bit SSL encryption</p>
            </div>
            <div className={styles.securityItem}>
              <h3>✓ Regulatory Compliance</h3>
              <p>Fully compliant with SEC regulations and industry standards</p>
            </div>
            <div className={styles.securityItem}>
              <h3>🛡️ Secure Infrastructure</h3>
              <p>Multi-layer security with continuous monitoring and updates</p>
            </div>
          </div>
        </EPContainer>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.ctaTitle}>Ready to Start Earning?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of investors growing their wealth with EarnPrime
          </p>
          <EPButton size="lg" onClick={handleGetStarted}>
            Create Your Account
          </EPButton>
        </EPContainer>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <EPContainer maxWidth="xl">
          <p className={styles.footerText}>
            &copy; {new Date().getFullYear()} EarnPrime. All rights reserved.
          </p>
        </EPContainer>
      </footer>
    </div>
  )
}
