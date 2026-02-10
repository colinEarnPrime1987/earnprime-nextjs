'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import styles from './electronic-consent.module.css'

export default function ElectronicConsentPage() {
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
          <h1 className={styles.heroTitle}>Electronic Disclosure & Consent</h1>
          <p className={styles.heroSubtitle}>Last Updated: {new Date().toLocaleDateString()}</p>
        </EPContainer>
      </section>

      <section className={styles.content}>
        <EPContainer maxWidth="lg">
          <div className={styles.legalContent}>
            <div className={styles.section}>
              <h2>1. Consent to Electronic Delivery</h2>
              <p>
                By consenting to this Electronic Disclosure & Consent Agreement, you agree to receive all communications,
                agreements, documents, notices, and disclosures (collectively, &quot;Communications&quot;) electronically from
                EarnPrime Securities, LLC (&quot;EarnPrime&quot;) rather than in paper form.
              </p>
              <p>
                This consent applies to all Communications related to your brokerage account, including but not limited to:
              </p>
              <ul>
                <li>Account statements and confirmations</li>
                <li>Tax documents (e.g., 1099 forms)</li>
                <li>Regulatory notices and disclosures</li>
                <li>Privacy policies and updates</li>
                <li>Account agreements and amendments</li>
                <li>Prospectuses and offering documents</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>2. Hardware and Software Requirements</h2>
              <p>
                To access and retain electronic Communications, you will need the following:
              </p>
              <ul>
                <li>A computer or mobile device with internet access</li>
                <li>A current web browser that supports 256-bit encryption (e.g., Chrome, Firefox, Safari, Edge)</li>
                <li>A valid email address on file with EarnPrime</li>
                <li>Sufficient storage space to save Communications or a printer to print them</li>
                <li>Software capable of viewing PDF files (e.g., Adobe Acrobat Reader)</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>3. How to Withdraw Consent</h2>
              <p>
                You may withdraw your consent to receive electronic Communications at any time by contacting us at
                support@earnprime.com or by calling 1-800-EARN-PRIME. If you withdraw consent, we may close your account
                or charge fees for paper delivery as permitted by applicable law. Withdrawal of consent will be effective
                after we have had a reasonable period to process your request.
              </p>
            </div>

            <div className={styles.section}>
              <h2>4. Updating Your Contact Information</h2>
              <p>
                You are responsible for keeping your email address and other contact information current. You can update
                your information by logging into your account settings or contacting customer support. Failure to maintain
                a valid email address may result in missed Communications.
              </p>
            </div>

            <div className={styles.section}>
              <h2>5. Paper Copies</h2>
              <p>
                You may request a paper copy of any electronic Communication by contacting us at support@earnprime.com.
                Paper copies may be subject to a processing fee. We will provide the paper copy within a reasonable
                timeframe after receiving your request.
              </p>
            </div>

            <div className={styles.section}>
              <h2>6. Federal and State Law</h2>
              <p>
                This consent is provided in accordance with the Electronic Signatures in Global and National Commerce Act
                (E-SIGN Act), 15 U.S.C. &sect; 7001 et seq., and applicable state laws governing electronic transactions.
                Your consent confirms that you can access the Communications electronically and that you understand and
                agree to the terms of this disclosure.
              </p>
            </div>

            <div className={styles.section}>
              <h2>7. Contact Us</h2>
              <p>If you have questions about this Electronic Disclosure & Consent, please contact us:</p>
              <ul>
                <li>Email: support@earnprime.com</li>
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
