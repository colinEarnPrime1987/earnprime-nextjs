'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import styles from './learn.module.css'

export default function LearnPage() {
  const router = useRouter()

  const resources = {
    guides: [
      {
        title: "Beginner's Guide to Short-Term Investing",
        description: 'Everything you need to know to get started with short-term investment notes',
        icon: '📚',
        level: 'Beginner',
      },
      {
        title: 'Understanding Risk and Returns',
        description: 'Learn how to evaluate risk ratings and expected returns on investment opportunities',
        icon: '📊',
        level: 'Beginner',
      },
      {
        title: 'Advanced Portfolio Strategies',
        description: 'Sophisticated techniques for diversification and portfolio optimization',
        icon: '🎯',
        level: 'Advanced',
      },
      {
        title: 'Tax Planning for Investors',
        description: 'Maximize after-tax returns with strategic tax planning and reporting',
        icon: '💰',
        level: 'Intermediate',
      },
    ],
    glossary: [
      {
        term: 'Investment Note',
        definition:
          'A debt security with a fixed term and specified interest rate, representing a loan to the issuer.',
      },
      {
        term: 'Maturity Date',
        definition: 'The date when an investment note expires and the principal is returned to the investor.',
      },
      {
        term: 'APY (Annual Percentage Yield)',
        definition: 'The effective annual rate of return taking into account the effect of compounding interest.',
      },
      {
        term: 'Accredited Investor',
        definition:
          'An individual or entity meeting specific income or net worth thresholds, qualifying for certain investment opportunities.',
      },
      {
        term: 'Risk Rating',
        definition:
          'An assessment of the potential risk associated with an investment, typically on a scale from low to high.',
      },
      {
        term: 'Liquidity',
        definition: 'The ease with which an investment can be converted to cash without significant loss of value.',
      },
    ],
    videos: [
      {
        title: 'How EarnPrime Works',
        duration: '3:45',
        description: 'A quick overview of the EarnPrime platform and investment process',
      },
      {
        title: 'Reading Investment Note Details',
        duration: '5:20',
        description: 'Learn how to interpret note terms, risk ratings, and expected returns',
      },
      {
        title: 'Building Your First Portfolio',
        duration: '8:15',
        description: 'Step-by-step guide to selecting and diversifying your initial investments',
      },
    ],
  }

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
          <h1 className={styles.heroTitle}>Learning Center</h1>
          <p className={styles.heroSubtitle}>
            Educational resources to help you become a confident and successful investor
          </p>
        </EPContainer>
      </section>

      <section className={styles.guides}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.sectionTitle}>Investment Guides</h2>
          <div className={styles.guidesGrid}>
            {resources.guides.map((guide, index) => (
              <div key={index} className={styles.guideCard}>
                <div className={styles.guideIcon}>{guide.icon}</div>
                <div className={styles.guideContent}>
                  <div className={styles.guideLevel}>{guide.level}</div>
                  <h3 className={styles.guideTitle}>{guide.title}</h3>
                  <p className={styles.guideDescription}>{guide.description}</p>
                  <EPButton variant="outline" size="sm">
                    Read Guide
                  </EPButton>
                </div>
              </div>
            ))}
          </div>
        </EPContainer>
      </section>

      <section className={styles.glossary}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.sectionTitle}>Investment Glossary</h2>
          <p className={styles.sectionSubtitle}>Common terms and definitions every investor should know</p>
          <div className={styles.glossaryGrid}>
            {resources.glossary.map((item, index) => (
              <div key={index} className={styles.glossaryItem}>
                <h3 className={styles.glossaryTerm}>{item.term}</h3>
                <p className={styles.glossaryDefinition}>{item.definition}</p>
              </div>
            ))}
          </div>
        </EPContainer>
      </section>

      <section className={styles.videos}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.sectionTitle}>Video Tutorials</h2>
          <div className={styles.videosGrid}>
            {resources.videos.map((video, index) => (
              <div key={index} className={styles.videoCard}>
                <div className={styles.videoThumbnail}>
                  <div className={styles.playButton}>▶</div>
                  <div className={styles.videoDuration}>{video.duration}</div>
                </div>
                <h3 className={styles.videoTitle}>{video.title}</h3>
                <p className={styles.videoDescription}>{video.description}</p>
              </div>
            ))}
          </div>
        </EPContainer>
      </section>

      <section className={styles.cta}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.ctaTitle}>Ready to Put Your Knowledge to Work?</h2>
          <p className={styles.ctaSubtitle}>Start investing with confidence on EarnPrime</p>
          <EPButton size="lg" onClick={() => router.push('/register')}>
            Create Your Account
          </EPButton>
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
