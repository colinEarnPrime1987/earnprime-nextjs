'use client'

import AnimatedBackground from '@/components/base/AnimatedBackground'
import AnimatedLogo from '@/components/base/AnimatedLogo'
import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import NavHeader from '@/components/layout/NavHeader'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './page.module.css'

export default function LandingPage() {
  const router = useRouter()
  const heroSectionRef = useRef<HTMLElement>(null)
  const featuresSectionRef = useRef<HTMLElement>(null)
  const [scrollY, setScrollY] = useState(0)
  // Computed properties for parallax effects
  const parallaxOffset = useMemo(() => Math.min(scrollY, 800), [scrollY])

  const contentOpacity = useMemo(() => {
    const fadeStart = 300
    const fadeEnd = 600
    if (scrollY < fadeStart) return 1
    if (scrollY > fadeEnd) return 0
    return 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart)
  }, [scrollY])

  const scrollIndicatorOpacity = useMemo(() => {
    return Math.max(0, 1 - scrollY / 200)
  }, [scrollY])

  const currentYear = new Date().getFullYear()

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleGetStarted = () => {
    router.push('/register')
  }

  const scrollToSection = (sectionRef: React.RefObject<HTMLElement | null>) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleLearnMore = () => {
    scrollToSection(featuresSectionRef)
  }

  return (
    <div className={styles.landingPage}>
      <NavHeader />

      {/* Hero Section */}
      <section ref={heroSectionRef} className={styles.hero}>
        {/* Animated Background */}
        <AnimatedBackground style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }} />

        {/* Content */}
        <EPContainer maxWidth="xl">
          <div
            className={styles.heroContent}
            style={{
              opacity: contentOpacity,
              transform: `translateY(${parallaxOffset * 0.3}px)`,
            }}
          >
            {/* Animated SVG Logo */}
            <AnimatedLogo width={700} height={145} className={`${styles.heroAnimatedLogo} light`} />

            <h1 className={styles.heroTitle}>
              Trade in your Bank CDs for <span className={styles.textPrimaryGlow}>EarnPrime Short Term Notes</span>
            </h1>
            {/* <p className={styles.heroSubtitle}>
              Start earning 6.75% APY today. Most banks let you borrow at the prime rate, we let you earn interest at
              the prime rate.
            </p> */}

            {/* Comparison Banner */}
            <div className={styles.heroBannerComparison}>
              <div className={styles.comparisonTable}>
                <div className={styles.comparisonRow}>
                  <div className={styles.comparisonCell}></div>
                  <div className={styles.comparisonCell}>Money Market</div>
                  <div className={styles.comparisonCell}>Bank CDs</div>
                  <div className={styles.comparisonCell}>Annuity</div>
                  <div className={styles.comparisonCell + ' ' + styles.comparisonCellHighlight}>Short Term Notes</div>
                </div>
                <div className={styles.comparisonRow}>
                  <div className={styles.comparisonCell}>
                    <strong>Yield</strong>
                  </div>
                  <div className={styles.comparisonCell}>3.50%</div>
                  <div className={styles.comparisonCell}>4.00%</div>
                  <div className={styles.comparisonCell}>6.50%</div>
                  <div className={styles.comparisonCell + ' ' + styles.comparisonCellHighlight}>6.75%</div>
                </div>
                <div className={styles.comparisonRow}>
                  <div className={styles.comparisonCell}>
                    <strong>Term</strong>
                  </div>
                  <div className={styles.comparisonCell}>Daily</div>
                  <div className={styles.comparisonCell}>12 mo</div>
                  <div className={styles.comparisonCell}>5+ yrs</div>
                  <div className={styles.comparisonCell + ' ' + styles.comparisonCellHighlight}>9 mo</div>
                </div>
                <div className={styles.comparisonRow}>
                  <div className={styles.comparisonCell}>
                    <strong>Rate</strong>
                  </div>
                  <div className={styles.comparisonCell}>Variable</div>
                  <div className={styles.comparisonCell}>Fixed</div>
                  <div className={styles.comparisonCell}>Fixed</div>
                  <div className={styles.comparisonCell + ' ' + styles.comparisonCellHighlight}>Fixed</div>
                </div>
              </div>
            </div>

            <div className={styles.heroActions}>
              <EPButton size="md" onClick={handleGetStarted}>
                Get Started
              </EPButton>
              <EPButton variant="outline" size="md" onClick={handleLearnMore}>
                Learn More
              </EPButton>
            </div>
          </div>
        </EPContainer>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator} style={{ opacity: scrollIndicatorOpacity }}>
          <div className={styles.scrollIndicatorText}>Scroll to explore</div>
          <div className={styles.scrollIndicatorArrow}>↓</div>
        </div>
      </section>

      {/* Featured In Section */}
      <section ref={featuresSectionRef} className={styles.featuredIn}>
        <EPContainer maxWidth="xl">
          <h2 className={styles.featuredInTitle}>Featured In</h2>
          <div className={styles.logosCarousel}>
            <div className={styles.logoItem}>Wall Street Journal</div>
            <div className={styles.logoItem}>NYTimes</div>
            <div className={styles.logoItem}>Forbes</div>
            <div className={styles.logoItem}>Financial Times</div>
            <div className={styles.logoItem}>Bloomberg</div>
            <div className={styles.logoItem}>Barron's</div>
            <div className={styles.logoItem}>Fortune</div>
            <div className={styles.logoItem}>Morningstar</div>
            <div className={styles.logoItem}>CNBC</div>
            <div className={styles.logoItem}>Inc</div>
            <div className={styles.logoItem}>Wired</div>
            <div className={styles.logoItem}>MarketWatch</div>
            <div className={styles.logoItem}>The Economist</div>
            <div className={styles.logoItem}>Money.com</div>
          </div>
        </EPContainer>
      </section>

      {/* Product Details Section */}
      <section className={styles.productDetails}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.productTitle}>Product: EarnPrime Short Term Notes</h2>
          <div className={styles.productHighlight}>
            <div className={styles.productHighlightItem}>
              <span className={styles.productHighlightValue}>270-day term</span>
              <span className={styles.productHighlightLabel}>~9 months</span>
            </div>
            <div className={styles.productHighlightItem}>
              <span className={styles.productHighlightValue}>6.75% APY</span>
              <span className={styles.productHighlightLabel}>Fixed rate</span>
            </div>
          </div>

          <div className={styles.productFeatures}>
            <div className={styles.productFeature}>
              <strong>Fixed rate for the term of the note</strong>, just like a bank CD.
            </div>
            <div className={styles.productFeature}>
              <strong>Compound Interest:</strong> interest will accrue and compound daily, then be paid out at maturity.
              This allows customers to earn +0.2% more per year, compared to paying interest monthly.
            </div>
            <div className={styles.productFeature}>
              <strong>$25,000 minimum denomination</strong>, intended for accredited investors.
            </div>
            <div className={styles.productFeature}>
              <strong>Available:</strong> $25,000 | $50,000 | $75,000 | $100,000 (any amount & combination)
            </div>
            <div className={styles.productFeature}>
              <strong>Automatic renewal</strong>, so you keep earning interest. At maturity, notes will auto-renew at
              the Prime Rate (Federal Funds rate +3.0%) to allow for further compounding of returns.
            </div>
            <div className={styles.productFeature}>
              <strong>Withdrawal at maturity</strong> is available with 30 days notice. No penalty.
            </div>
            <div className={styles.productFeature}>
              <strong>Early withdrawal</strong> is available with 30 days notice, but will forfeit the last 90 days
              worth of interest earned.
            </div>
            <div className={styles.productFeature}>
              <strong>Tax-friendly:</strong> 1099 tax forms
            </div>
            <div className={styles.productFeature}>
              <strong>No fees, ever.</strong> Keep 100% of the interest earned.
            </div>
          </div>

          <div className={styles.productCta}>
            <EPButton size="lg" onClick={handleGetStarted}>
              Buy Short Term Notes
            </EPButton>
          </div>
        </EPContainer>
      </section>

      {/* Third-Party Reviews Section */}
      <section className={styles.reviews}>
        <EPContainer maxWidth="xl">
          <h2 className={styles.reviewsTitle}>Third-party Reviews and Ratings</h2>
          <div className={styles.reviewsGrid}>
            <div className={styles.reviewItem}>Google Reviews</div>
            <div className={styles.reviewItem}>Trust Pilot</div>
            <div className={styles.reviewItem}>Better Business Bureau</div>
          </div>
        </EPContainer>
      </section>

      {/* Comparison Table Section */}
      {/* <section className={styles.comparison}>
        <EPContainer maxWidth="xl">
          <h2 className={styles.comparisonTitle}>Compare</h2>
          <div className={styles.comparisonTable}>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonCell}></div>
              <div className={styles.comparisonCell}>Money Market & High-yield Savings</div>
              <div className={styles.comparisonCell}>Bank CDs</div>
              <div className={styles.comparisonCell}>Annuity (Fixed-rate)</div>
              <div className={styles.comparisonCell + ' ' + styles.comparisonCellHighlight}>Short Term Notes</div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonCell}><strong>Yield</strong></div>
              <div className={styles.comparisonCell}>3.50%</div>
              <div className={styles.comparisonCell}>4.00%</div>
              <div className={styles.comparisonCell}>6.50%</div>
              <div className={styles.comparisonCell + ' ' + styles.comparisonCellHighlight}>6.75%</div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonCell}><strong>Term/Lock-up</strong></div>
              <div className={styles.comparisonCell}>Daily</div>
              <div className={styles.comparisonCell}>12 months</div>
              <div className={styles.comparisonCell}>5+ years</div>
              <div className={styles.comparisonCell + ' ' + styles.comparisonCellHighlight}>9 months</div>
            </div>
            <div className={styles.comparisonRow}>
              <div className={styles.comparisonCell}><strong>Rate</strong></div>
              <div className={styles.comparisonCell}>Variable</div>
              <div className={styles.comparisonCell}>Fixed</div>
              <div className={styles.comparisonCell}>Fixed</div>
              <div className={styles.comparisonCell + ' ' + styles.comparisonCellHighlight}>Fixed</div>
            </div>
          </div>
        </EPContainer>
      </section> */}

      {/* Featured By Section */}
      <section className={styles.featuredBy}>
        <EPContainer maxWidth="xl">
          <h2 className={styles.featuredByTitle}>Featured by</h2>
          <div className={styles.logosCarousel}>
            <div className={styles.logoItem}>NerdWallet</div>
            <div className={styles.logoItem}>Seeking Alpha</div>
            <div className={styles.logoItem}>Investopedia</div>
            <div className={styles.logoItem}>Kiplinger</div>
            <div className={styles.logoItem}>Bankrate</div>
            <div className={styles.logoItem}>CNN Money</div>
            <div className={styles.logoItem}>Wallet Hub</div>
            <div className={styles.logoItem}>MoneyRates.com</div>
            <div className={styles.logoItem}>The Points Guy</div>
            <div className={styles.logoItem}>Penny Hoarder</div>
            <div className={styles.logoItem}>Monarch Money</div>
            <div className={styles.logoItem}>Funding Hero</div>
          </div>
        </EPContainer>
      </section>

      {/* How It Works Section */}
      <section className={styles.howItWorks}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.howItWorksTitle}>How It Works</h2>
          <p className={styles.howItWorksIntro}>
            Behind the scenes at EarnPrime, the process works similarly to how your money works at a bank or a credit
            union:
          </p>

          <div className={styles.howItWorksList}>
            <div className={styles.howItWorksItem}>
              Incoming cash is pooled together and then lent out to creditworthy borrowers who pay a competitive
              interest rate to us in exchange for borrowing the money.
            </div>
            <div className={styles.howItWorksItem}>
              Most of the borrowers pay on time and in full, but some pay late or default on their loan. This leads to
              small losses.
            </div>
            <div className={styles.howItWorksItem}>
              We pay our customers the sum of the interest paid, less realized losses from defaults, less expenses
              incurred to run the firm.
            </div>
          </div>

          <h3 className={styles.howItWorksSubtitle}>
            But, although it's similar to a bank, we take a different approach:
          </h3>

          <p className={styles.howItWorksText}>
            A bank may originate their own loans or use the customer deposits to buy securitized blocks of loans in the
            public market (including: consumer mortgages, corporate loans, CLOs, ABS, MBS, etc).
          </p>

          <p className={styles.howItWorksText}>
            We pool our money and buy SEC-regulated mutual funds of diversified corporate loans made to privately-held
            US companies, originated by trusted partners with long track records of strong underwriting and low losses.
            The largest fund has investment-grade credit ratings ("A" and "AA" as of Q4-2025).
          </p>

          <h3 className={styles.howItWorksSubtitle}>
            This offers several key benefits over the traditional bank approach:
          </h3>

          <div className={styles.benefitsList}>
            <div className={styles.benefitItem}>
              <strong>Higher interest rates:</strong> we see base yields of +1.5% higher vs banks
            </div>
            <div className={styles.benefitItem}>
              <strong>Lower default rates, lower loss rates:</strong> this adds +0.5% to net yield vs banks
            </div>
            <div className={styles.benefitItem}>
              <strong>Lower internal expenses:</strong> this adds another +0.75% to net yield vs banks
            </div>
          </div>

          <p className={styles.howItWorksConclusion}>
            The result: we can offer guaranteed yields of +2.75% higher than the average 1-year bank CD rate (around
            4.0% today).
          </p>

          <div className={styles.howItWorksCta}>
            <EPButton variant="outline" onClick={() => router.push('/how-it-works')}>
              Learn more
            </EPButton>
          </div>
        </EPContainer>
      </section>

      {/* Customer Testimonials Section */}
      <section className={styles.testimonials}>
        <EPContainer maxWidth="xl">
          <h2 className={styles.testimonialsTitle}>Customer Testimonials</h2>
          <p className={styles.testimonialsPlaceholder}>Coming soon...</p>
        </EPContainer>
      </section>

      {/* About Us Section */}
      <section className={styles.aboutUs}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.aboutUsTitle}>About Us</h2>
          <p className={styles.aboutUsText}>
            EarnPrime is a not-for-profit, mission-driven company trying to educate and change the way people think
            about low-risk, short-term investments, such as bank CDs.
          </p>
          <p className={styles.aboutUsText}>
            The banking industry has changed over the last 30 years, yet most people are unaware of the new
            opportunities that exist today.
          </p>
          <div className={styles.aboutUsCta}>
            <EPButton variant="outline" onClick={() => router.push('/about')}>
              Learn more
            </EPButton>
          </div>
        </EPContainer>
      </section>

      {/* Referral Program Section */}
      <section className={styles.referral}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.referralTitle}>Refer your friends & family</h2>
          <p className={styles.referralSubtitle}>Earn up to a $500 bonus with each referral, with no maximum.</p>

          <div className={styles.referralDetails}>
            <p>
              Each referral must sign up, transfer cash into their EarnPrime wallet, and purchase an EarnPrime Note of
              any amount.
            </p>

            <div className={styles.referralBonuses}>
              <div className={styles.referralBonus}>
                $25,000 Note → <strong>$200 bonus</strong>
              </div>
              <div className={styles.referralBonus}>
                $50,000 Note → <strong>$300 bonus</strong>
              </div>
              <div className={styles.referralBonus}>
                $75,000 Note → <strong>$400 bonus</strong>
              </div>
              <div className={styles.referralBonus}>
                $100,000 Note → <strong>$500 bonus</strong>
              </div>
            </div>

            <p className={styles.referralDisclaimer}>
              Bonus cash is added to your EarnPrime wallet, but may not be withdrawn until the completion of the
              referral's initial 9-month Note term.
            </p>
          </div>
        </EPContainer>
      </section>

      {/* Back to Top Button */}
      <button
        className={`${styles.backToTop} ${scrollY > 400 ? styles.backToTopVisible : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
      >
        ↑
      </button>

      {/* Footer */}
      <footer className={styles.footer}>
        <EPContainer maxWidth="xl">
          <div className={styles.footerContent}>
            {/* Logo and tagline section */}
            <div className={styles.footerBrand}>
              <img
                src="/assets/Logo files/PNGs - SVGs/SVG/Asset 3.svg"
                alt="EarnPrime Logo"
                className={styles.footerLogo}
              />
              <p className={styles.footerTagline}>Secure short-term investments designed for growth</p>
            </div>

            {/* 4-column navigation grid */}
            <div className={styles.footerGrid}>
              {/* Company column */}
              <div className={styles.footerColumn}>
                <h3 className={styles.footerColumnTitle}>Company</h3>
                <ul className={styles.footerLinks}>
                  <li>
                    <Link href="/about">About Us</Link>
                  </li>
                  <li>
                    <Link href="/blog">Blog</Link>
                  </li>
                  <li>
                    <Link href="/testimonials">Testimonials</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </div>

              {/* Resources column */}
              <div className={styles.footerColumn}>
                <h3 className={styles.footerColumnTitle}>Resources</h3>
                <ul className={styles.footerLinks}>
                  <li>
                    <Link href="/learn">Learning Center</Link>
                  </li>
                  <li>
                    <Link href="/how-it-works">How It Works</Link>
                  </li>
                  <li>
                    <Link href="/faq">FAQ</Link>
                  </li>
                  <li>
                    <Link href="/help">Help Center</Link>
                  </li>
                  <li>
                    <Link href="/calculator">Investment Calculator</Link>
                  </li>
                  <li>
                    <Link href="/calculator/mortgage">Mortgage Calculator</Link>
                  </li>
                  <li>
                    <Link href="/calculator/loan">Loan Calculator</Link>
                  </li>
                </ul>
              </div>

              {/* Legal column */}
              <div className={styles.footerColumn}>
                <h3 className={styles.footerColumnTitle}>Legal</h3>
                <ul className={styles.footerLinks}>
                  <li>
                    <Link href="/privacy">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/terms">Terms of Service</Link>
                  </li>
                  <li>
                    <Link href="/security">Security</Link>
                  </li>
                </ul>
              </div>

              {/* Support column */}
              <div className={styles.footerColumn}>
                <h3 className={styles.footerColumnTitle}>Support</h3>
                <ul className={styles.footerLinks}>
                  <li>
                    <Link href="/contact">Contact Us</Link>
                  </li>
                  <li>
                    <a href="mailto:support@earnprime.com">support@earnprime.com</a>
                  </li>
                  <li>
                    <a href="tel:1-800-327-6774">1-800-EARN-PRIME</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright section */}
            <div className={styles.footerBottom}>
              <p className={styles.footerCopyright}>&copy; {currentYear} EarnPrime. All rights reserved.</p>
            </div>
          </div>
        </EPContainer>
      </footer>
    </div>
  )
}
