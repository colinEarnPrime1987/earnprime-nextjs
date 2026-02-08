'use client'

import AnimatedBackground from '@/components/base/AnimatedBackground'
import AnimatedLogo from '@/components/base/AnimatedLogo'
import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './page.module.css'

export default function LandingPage() {
  const router = useRouter()
  const heroSectionRef = useRef<HTMLElement>(null)
  const featuresSectionRef = useRef<HTMLElement>(null)
  const ctaSectionRef = useRef<HTMLElement>(null)

  const [scrollY, setScrollY] = useState(0)
  const [featuresVisible, setFeaturesVisible] = useState(false)
  const [ctaVisible, setCtaVisible] = useState(false)

  // Features data
  const features = [
    {
      title: 'High Returns',
      description: 'Competitive interest rates up to 6.70% APY on short-term notes with flexible terms.',
      icon: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#00EA96" opacity="0.1"/>
        <path d="M24 12L28 20H20L24 12Z" fill="#00EA96"/>
        <rect x="16" y="28" width="16" height="4" fill="#00EA96"/>
      </svg>`,
    },
    {
      title: 'Short-Term Flexibility',
      description: '270-day maturity with options for auto-renewal or monthly interest payments.',
      icon: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#00EA96" opacity="0.1"/>
        <circle cx="24" cy="24" r="8" stroke="#00EA96" stroke-width="2" fill="none"/>
        <path d="M24 16V24L28 28" stroke="#00EA96" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
    },
    {
      title: 'Bank-Level Security',
      description: 'Your investments are protected with enterprise-grade encryption and secure banking integration.',
      icon: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#00EA96" opacity="0.1"/>
        <rect x="16" y="16" width="16" height="16" rx="2" stroke="#00EA96" stroke-width="2" fill="none"/>
        <path d="M20 24L23 27L28 21" stroke="#00EA96" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
    },
    {
      title: 'Easy Access',
      description: 'Manage your investments anywhere with our mobile-ready platform and intuitive dashboard.',
      icon: `<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="12" fill="#00EA96" opacity="0.1"/>
        <rect x="18" y="14" width="12" height="20" rx="2" stroke="#00EA96" stroke-width="2" fill="none"/>
        <line x1="21" y1="18" x2="27" y2="18" stroke="#00EA96" stroke-width="2"/>
        <line x1="21" y1="22" x2="27" y2="22" stroke="#00EA96" stroke-width="2"/>
      </svg>`,
    },
  ]

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

      // Check if sections are in viewport
      if (featuresSectionRef.current) {
        const rect = featuresSectionRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.75) {
          setFeaturesVisible(true)
        }
      }

      if (ctaSectionRef.current) {
        const rect = ctaSectionRef.current.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.75) {
          setCtaVisible(true)
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Smooth scroll to section
  const scrollToSection = (sectionRef: React.RefObject<HTMLElement | null>) => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleGetStarted = () => {
    router.push('/register')
  }

  const handleLogin = () => {
    router.push('/login')
  }

  const handleLearnMore = () => {
    scrollToSection(featuresSectionRef)
  }

  return (
    <div className={styles.landingPage}>
      {/* Navigation Bar */}
      <nav className={styles.nav}>
        <EPContainer maxWidth="xl">
          <div className={styles.navContent}>
            <div className={styles.navLogo} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
              <img
                src="/assets/Logo files/PNGs - SVGs/SVG/Asset 3.svg"
                alt="EarnPrime Logo"
                className={styles.navLogoImage}
              />
            </div>
            <div className={styles.navLinks}>
              <Link href="/how-it-works">How It Works</Link>
              <Link href="/about">About Us</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/learn">Resources</Link>
            </div>
            <div className={styles.navActions}>
              <EPButton size="sm" variant="outline" onClick={handleLogin}>
                Login
              </EPButton>
              <EPButton size="sm" onClick={handleGetStarted}>
                Sign Up
              </EPButton>
            </div>
          </div>
        </EPContainer>
      </nav>

      {/* Hero Section with Animated Background */}
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
            <AnimatedLogo width={700} height={285} className={`${styles.heroAnimatedLogo} light`} />

            <h1 className={styles.heroTitle}>
              Invest in Your <span className={styles.textPrimaryGlow}>Prime</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Secure, transparent short-term investment notes designed to help you grow your wealth with confidence.
            </p>
            <div className={styles.heroActions}>
              <EPButton size="lg" onClick={handleGetStarted}>
                Get Started
              </EPButton>
              <EPButton size="lg" variant="outline" onClick={handleLearnMore}>
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

      {/* Features Section */}
      <section ref={featuresSectionRef} className={styles.features}>
        <EPContainer maxWidth="xl">
          <h2 className={`${styles.featuresTitle} ${featuresVisible ? styles.fadeInUp : ''}`}>Why Choose EarnPrime?</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                key={index}
                className={`${styles.featureCard} ${featuresVisible ? styles.fadeInUp : ''}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={styles.featureCardIcon} dangerouslySetInnerHTML={{ __html: feature.icon }}></div>
                <h3 className={styles.featureCardTitle}>{feature.title}</h3>
                <p className={styles.featureCardDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </EPContainer>
      </section>

      {/* CTA Section */}
      <section ref={ctaSectionRef} className={`${styles.cta} ${ctaVisible ? styles.fadeIn : ''}`}>
        <EPContainer maxWidth="lg">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Earning?</h2>
            <p className={styles.ctaSubtitle}>Join EarnPrime today and take control of your financial future.</p>
            <EPButton size="lg" onClick={handleGetStarted}>
              Create Your Account
            </EPButton>
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
