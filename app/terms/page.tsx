'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import styles from './terms.module.css'

export default function TermsPage() {
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
          <h1 className={styles.heroTitle}>Terms of Service</h1>
          <p className={styles.heroSubtitle}>Last Updated: {new Date().toLocaleDateString()}</p>
        </EPContainer>
      </section>

      <section className={styles.content}>
        <EPContainer maxWidth="lg">
          <div className={styles.legalContent}>
            <div className={styles.section}>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using EarnPrime's services, you accept and agree to be bound by these Terms of Service
                and our Privacy Policy. If you do not agree to these terms, please do not use our services.
              </p>
            </div>

            <div className={styles.section}>
              <h2>2. Eligibility</h2>
              <p>You must meet the following requirements to use our services:</p>
              <ul>
                <li>Be at least 18 years of age</li>
                <li>Be a legal resident of the United States</li>
                <li>Provide accurate and complete registration information</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Meet accredited investor requirements where applicable</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>3. Account Registration and Security</h2>
              <p>When creating an account, you agree to:</p>
              <ul>
                <li>Provide truthful, accurate, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the confidentiality of your login credentials</li>
                <li>Notify us immediately of any unauthorized access to your account</li>
                <li>Accept responsibility for all activities conducted through your account</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>4. Investment Terms</h2>
              <p>
                <strong>Risk Disclosure:</strong> Investments involve risk, including the potential loss of principal.
                Past performance does not guarantee future results. You should carefully review all investment materials
                and consult with financial advisors before investing.
              </p>
              <p>Key investment terms:</p>
              <ul>
                <li>Minimum investment amounts apply to each note type</li>
                <li>Investment notes have specific maturity dates and early withdrawal penalties</li>
                <li>Returns are not guaranteed and may vary based on market conditions</li>
                <li>You acknowledge reading and understanding all investment disclosures</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>5. Fees and Charges</h2>
              <p>Our fee structure includes:</p>
              <ul>
                <li>No account creation or maintenance fees</li>
                <li>No fees for ACH deposits or standard withdrawals</li>
                <li>Wire transfer fees as disclosed at the time of transaction</li>
                <li>Early withdrawal penalties as specified in each note's terms</li>
                <li>We reserve the right to modify fees with 30 days' notice</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>6. Prohibited Activities</h2>
              <p>You agree not to:</p>
              <ul>
                <li>Use our services for any illegal purpose or in violation of any laws</li>
                <li>Provide false or misleading information</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Engage in fraudulent activity or money laundering</li>
                <li>Transfer your account to another person without our consent</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>7. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, EARNPRIME SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
                SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED
                DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </div>

            <div className={styles.section}>
              <h2>8. Dispute Resolution and Arbitration</h2>
              <p>
                Any disputes arising from these Terms shall be resolved through binding arbitration rather than in
                court, except that you may assert claims in small claims court if your claims qualify. This arbitration
                agreement is governed by the Federal Arbitration Act.
              </p>
            </div>

            <div className={styles.section}>
              <h2>9. Modifications to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of material changes
                through email or platform notification. Your continued use of the service after changes constitutes
                acceptance of the modified Terms.
              </p>
            </div>

            <div className={styles.section}>
              <h2>10. Termination</h2>
              <p>
                We may suspend or terminate your account at any time for violation of these Terms, fraudulent activity,
                or as required by law. Upon termination, you remain liable for all outstanding obligations, and we will
                return uninvested funds in accordance with our policies.
              </p>
            </div>

            <div className={styles.section}>
              <h2>11. Contact Information</h2>
              <p>For questions regarding these Terms, contact us:</p>
              <ul>
                <li>Email: legal@earnprime.com</li>
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
