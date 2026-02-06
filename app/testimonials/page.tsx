'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import styles from './testimonials.module.css'

export default function TestimonialsPage() {
  const router = useRouter()

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      avatar: 'SJ',
      rating: 5,
      text: "EarnPrime has transformed how I invest my business's excess capital. The returns are consistent, the platform is easy to use, and I appreciate the transparency in every investment opportunity.",
      highlight: 'Earned $12,500 in 6 months',
    },
    {
      name: 'Michael Chen',
      role: 'Software Engineer',
      avatar: 'MC',
      rating: 5,
      text: 'As a tech professional, I appreciate the robust security measures and modern interface. The short-term notes fit perfectly with my investment strategy, and customer support has been excellent.',
      highlight: '8.2% average return',
    },
    {
      name: 'Jennifer Martinez',
      role: 'Retired Educator',
      avatar: 'JM',
      rating: 5,
      text: "I was skeptical about online investing platforms, but EarnPrime's educational resources and responsive support team made me feel confident. I've been investing for over a year now with great results.",
      highlight: 'Investing for 14 months',
    },
    {
      name: 'David Thompson',
      role: 'Real Estate Investor',
      avatar: 'DT',
      rating: 5,
      text: 'EarnPrime provides excellent diversification for my portfolio. The short-term nature of the notes gives me flexibility, and the returns outperform traditional savings by a significant margin.',
      highlight: '$50,000 invested',
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Marketing Executive',
      avatar: 'LR',
      rating: 5,
      text: "The automated reinvestment feature and monthly interest payments have helped me build wealth consistently. It's become my preferred platform for short-term investments.",
      highlight: 'Consistent 7.5% returns',
    },
    {
      name: 'Robert Kim',
      role: 'Financial Advisor',
      avatar: 'RK',
      rating: 5,
      text: "I've recommended EarnPrime to several clients. The platform's compliance, transparent fee structure, and risk disclosure make it a trustworthy option for accredited investors seeking short-term opportunities.",
      highlight: 'Advisor for 3+ clients',
    },
  ]

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
          <h1 className={styles.heroTitle}>What Our Investors Say</h1>
          <p className={styles.heroSubtitle}>
            Join thousands of satisfied investors growing their wealth with EarnPrime
          </p>
        </EPContainer>
      </section>

      <section className={styles.stats}>
        <EPContainer maxWidth="lg">
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <div className={styles.statNumber}>50,000+</div>
              <div className={styles.statLabel}>Happy Investors</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>4.9/5</div>
              <div className={styles.statLabel}>Average Rating</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNumber}>98%</div>
              <div className={styles.statLabel}>Would Recommend</div>
            </div>
          </div>
        </EPContainer>
      </section>

      <section className={styles.testimonials}>
        <EPContainer maxWidth="lg">
          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className={styles.testimonialCard}>
                <div className={styles.testimonialHeader}>
                  <div className={styles.avatar}>{testimonial.avatar}</div>
                  <div className={styles.testimonialInfo}>
                    <h3 className={styles.testimonialName}>{testimonial.name}</h3>
                    <p className={styles.testimonialRole}>{testimonial.role}</p>
                  </div>
                  <div className={styles.rating}>
                    {'★'.repeat(testimonial.rating)}
                  </div>
                </div>
                <p className={styles.testimonialText}>"{testimonial.text}"</p>
                <div className={styles.highlight}>{testimonial.highlight}</div>
              </div>
            ))}
          </div>
        </EPContainer>
      </section>

      <section className={styles.cta}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.ctaTitle}>Ready to Join Them?</h2>
          <p className={styles.ctaSubtitle}>Start your investment journey with EarnPrime today</p>
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
