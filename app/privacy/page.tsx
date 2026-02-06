'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import styles from './privacy.module.css'

export default function PrivacyPage() {
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
          <h1 className={styles.heroTitle}>Privacy Policy</h1>
          <p className={styles.heroSubtitle}>Last Updated: {new Date().toLocaleDateString()}</p>
        </EPContainer>
      </section>

      <section className={styles.content}>
        <EPContainer maxWidth="lg">
          <div className={styles.legalContent}>
            <div className={styles.section}>
              <h2>1. Information We Collect</h2>
              <p>
                We collect information that you provide directly to us, including when you create an account, make an
                investment, or contact customer support. This may include:
              </p>
              <ul>
                <li>Personal identification information (name, email, phone number, date of birth)</li>
                <li>Financial information (bank account details, investment history, income information)</li>
                <li>Identity verification documents (government-issued ID, social security number)</li>
                <li>Device and usage information (IP address, browser type, pages visited)</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>2. How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process your investments and transactions</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Communicate with you about your account and our services</li>
                <li>Comply with legal and regulatory requirements</li>
                <li>Analyze usage patterns and improve user experience</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>3. Information Sharing and Disclosure</h2>
              <p>We may share your information in the following circumstances:</p>
              <ul>
                <li>
                  <strong>Service Providers:</strong> We share information with third-party service providers who
                  perform services on our behalf
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose information if required by law or in response to
                  legal requests
                </li>
                <li>
                  <strong>Business Transfers:</strong> Information may be transferred in connection with a merger,
                  acquisition, or sale of assets
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share information for any other purpose with your explicit
                  consent
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>4. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your personal information, including:
              </p>
              <ul>
                <li>256-bit SSL encryption for data transmission</li>
                <li>Encrypted data storage</li>
                <li>Multi-factor authentication</li>
                <li>Regular security audits and penetration testing</li>
                <li>Strict access controls and employee training</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>5. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to collect information about your browsing activities.
                You can control cookies through your browser settings. Our use of cookies includes:
              </p>
              <ul>
                <li>Essential cookies for platform functionality</li>
                <li>Analytics cookies to understand usage patterns</li>
                <li>Preference cookies to remember your settings</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>6. Your Rights and Choices</h2>
              <p>You have the following rights regarding your personal information:</p>
              <ul>
                <li>Access and review your personal information</li>
                <li>Request corrections to inaccurate information</li>
                <li>Request deletion of your information (subject to legal requirements)</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>7. Data Retention</h2>
              <p>
                We retain your personal information for as long as necessary to provide our services and comply with
                legal obligations. Account information is retained for at least 7 years after account closure as
                required by financial regulations.
              </p>
            </div>

            <div className={styles.section}>
              <h2>8. Children's Privacy</h2>
              <p>
                Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal
                information from children. If you believe we have collected information from a child, please contact us
                immediately.
              </p>
            </div>

            <div className={styles.section}>
              <h2>9. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by
                posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </div>

            <div className={styles.section}>
              <h2>10. Contact Us</h2>
              <p>If you have questions about this Privacy Policy, please contact us:</p>
              <ul>
                <li>Email: privacy@earnprime.com</li>
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
