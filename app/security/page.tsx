'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import styles from './security.module.css'

export default function SecurityPage() {
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
          <h1 className={styles.heroTitle}>Your Security is Our Priority</h1>
          <p className={styles.heroSubtitle}>
            Bank-level security measures to protect your investments and personal information
          </p>
        </EPContainer>
      </section>

      <section className={styles.content}>
        <EPContainer maxWidth="lg">
          <div className={styles.legalContent}>
            <div className={styles.section}>
              <h2>🔒 Data Encryption</h2>
              <p>
                All data transmitted between your device and our servers is protected with 256-bit SSL/TLS encryption,
                the same technology used by major financial institutions. Your sensitive information is encrypted both
                in transit and at rest in our secure databases.
              </p>
              <ul>
                <li>256-bit SSL/TLS encryption for all data transmission</li>
                <li>AES-256 encryption for data at rest</li>
                <li>End-to-end encryption for sensitive transactions</li>
                <li>Regular security audits and penetration testing</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>🛡️ Multi-Factor Authentication</h2>
              <p>
                Protect your account with multiple layers of verification. We support various MFA methods to ensure only
                you can access your account:
              </p>
              <ul>
                <li>SMS-based one-time passwords (OTP)</li>
                <li>Authenticator app integration (Google Authenticator, Authy)</li>
                <li>Biometric authentication (fingerprint, face recognition)</li>
                <li>Email verification for sensitive actions</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>✓ Regulatory Compliance</h2>
              <p>EarnPrime is fully compliant with federal and state financial regulations:</p>
              <ul>
                <li>
                  <strong>SEC Registration:</strong> Registered with the Securities and Exchange Commission
                </li>
                <li>
                  <strong>FINRA Membership:</strong> Member of the Financial Industry Regulatory Authority
                </li>
                <li>
                  <strong>FinCEN Compliance:</strong> Full compliance with anti-money laundering (AML) regulations
                </li>
                <li>
                  <strong>KYC Requirements:</strong> Strict Know Your Customer verification processes
                </li>
                <li>
                  <strong>SOC 2 Type II Certified:</strong> Independently audited for security controls
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>💼 Insurance Coverage</h2>
              <p>Your investments are protected by multiple layers of insurance:</p>
              <ul>
                <li>
                  <strong>SIPC Protection:</strong> Securities protected up to $500,000 (including $250,000 in cash)
                </li>
                <li>
                  <strong>Excess SIPC Insurance:</strong> Additional coverage through Lloyd's of London
                </li>
                <li>
                  <strong>Cybersecurity Insurance:</strong> Protection against data breaches and cyber incidents
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>🔐 Secure Infrastructure</h2>
              <p>Our platform is built on enterprise-grade infrastructure with multiple security layers:</p>
              <ul>
                <li>
                  <strong>Cloud Security:</strong> Hosted on AWS with ISO 27001, SOC 2, and PCI DSS certified data
                  centers
                </li>
                <li>
                  <strong>Network Security:</strong> Advanced firewall protection and DDoS mitigation
                </li>
                <li>
                  <strong>Access Controls:</strong> Role-based access control (RBAC) and principle of least privilege
                </li>
                <li>
                  <strong>Monitoring:</strong> 24/7 security monitoring and intrusion detection systems
                </li>
                <li>
                  <strong>Incident Response:</strong> Dedicated security team with rapid response protocols
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>👥 Privacy Protection</h2>
              <p>We are committed to protecting your privacy:</p>
              <ul>
                <li>Never sell or share your personal information with third parties for marketing</li>
                <li>Strict data minimization - we only collect necessary information</li>
                <li>Regular privacy impact assessments</li>
                <li>GDPR and CCPA compliant data handling</li>
                <li>Transparent privacy policy with clear opt-out options</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>📱 Account Security Best Practices</h2>
              <p>Help us keep your account secure by following these best practices:</p>
              <ul>
                <li>Enable multi-factor authentication</li>
                <li>Use a strong, unique password (12+ characters with mixed case, numbers, symbols)</li>
                <li>Never share your login credentials</li>
                <li>Be cautious of phishing emails - we will never ask for your password via email</li>
                <li>Keep your email and phone number up to date</li>
                <li>Review account activity regularly</li>
                <li>Log out when using shared devices</li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>🚨 Report Security Concerns</h2>
              <p>If you suspect unauthorized access to your account or discover a security vulnerability:</p>
              <ul>
                <li>
                  <strong>Immediate Assistance:</strong> Call 1-800-EARN-PRIME (24/7 security hotline)
                </li>
                <li>
                  <strong>Security Team:</strong> Email security@earnprime.com
                </li>
                <li>
                  <strong>Vulnerability Disclosure:</strong> Email security-disclosure@earnprime.com
                </li>
              </ul>
            </div>

            <div className={styles.section}>
              <h2>📜 Security Certifications</h2>
              <p>EarnPrime maintains the following security certifications and standards:</p>
              <ul>
                <li>SOC 2 Type II</li>
                <li>ISO 27001</li>
                <li>PCI DSS Level 1</li>
                <li>NIST Cybersecurity Framework</li>
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
