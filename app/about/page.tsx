'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import styles from './about.module.css'

export default function AboutPage() {
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
          <h1 className={styles.heroTitle}>About EarnPrime</h1>
          <p className={styles.heroSubtitle}>
            Building the future of short-term investing with transparency, security, and innovation.
          </p>
        </EPContainer>
      </section>

      {/* Mission Section */}
      <section className={styles.mission}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.sectionTitle}>Our Mission</h2>
          <p className={styles.missionText}>
            EarnPrime was founded on a simple belief: everyone deserves access to secure, transparent, and profitable short-term investment opportunities. We're committed to democratizing wealth creation by providing a platform where investors can grow their capital with confidence.
          </p>
          <p className={styles.missionText}>
            Our platform combines cutting-edge technology with rigorous due diligence to offer investment notes that balance risk and reward. We believe in complete transparency, robust security, and putting our investors first in everything we do.
          </p>
        </EPContainer>
      </section>

      {/* Values Section */}
      <section className={styles.values}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.sectionTitle}>Our Core Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🎯</div>
              <h3 className={styles.valueTitle}>Transparency</h3>
              <p className={styles.valueDescription}>
                Clear terms, honest communication, and full disclosure on every investment opportunity.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>🔒</div>
              <h3 className={styles.valueTitle}>Security</h3>
              <p className={styles.valueDescription}>
                Bank-level encryption, regulatory compliance, and rigorous security protocols to protect your investments.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>⚡</div>
              <h3 className={styles.valueTitle}>Innovation</h3>
              <p className={styles.valueDescription}>
                Leveraging technology to create seamless investing experiences and new opportunities.
              </p>
            </div>

            <div className={styles.valueCard}>
              <div className={styles.valueIcon}>💚</div>
              <h3 className={styles.valueTitle}>Investor-First</h3>
              <p className={styles.valueDescription}>
                Your success is our success. We align our interests with yours and always put investors first.
              </p>
            </div>
          </div>
        </EPContainer>
      </section>

      {/* Team Section */}
      <section className={styles.team}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.sectionTitle}>Leadership Team</h2>
          <p className={styles.teamIntro}>
            Our team brings together decades of experience in finance, technology, and regulatory compliance.
          </p>
          <div className={styles.teamGrid}>
            <div className={styles.teamMember}>
              <div className={styles.memberPhoto}>JD</div>
              <h3 className={styles.memberName}>John Doe</h3>
              <p className={styles.memberTitle}>CEO & Co-Founder</p>
              <p className={styles.memberBio}>
                Former investment banker with 15+ years in structured finance and alternative investments.
              </p>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.memberPhoto}>JS</div>
              <h3 className={styles.memberName}>Jane Smith</h3>
              <p className={styles.memberTitle}>CTO & Co-Founder</p>
              <p className={styles.memberBio}>
                Technology leader with experience building secure fintech platforms at scale.
              </p>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.memberPhoto}>MJ</div>
              <h3 className={styles.memberName}>Michael Johnson</h3>
              <p className={styles.memberTitle}>Chief Compliance Officer</p>
              <p className={styles.memberBio}>
                Former SEC attorney specializing in securities law and regulatory compliance.
              </p>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.memberPhoto}>SK</div>
              <h3 className={styles.memberName}>Sarah Kim</h3>
              <p className={styles.memberTitle}>Head of Investments</p>
              <p className={styles.memberBio}>
                Seasoned portfolio manager with expertise in credit analysis and risk management.
              </p>
            </div>
          </div>
        </EPContainer>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <EPContainer maxWidth="lg">
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>$500M+</div>
              <div className={styles.statLabel}>Total Investment Volume</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>50,000+</div>
              <div className={styles.statLabel}>Active Investors</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>8.5%</div>
              <div className={styles.statLabel}>Average Annual Return</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>99.9%</div>
              <div className={styles.statLabel}>Platform Uptime</div>
            </div>
          </div>
        </EPContainer>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.ctaTitle}>Join Our Growing Community</h2>
          <p className={styles.ctaSubtitle}>
            Start your investment journey with EarnPrime today
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
