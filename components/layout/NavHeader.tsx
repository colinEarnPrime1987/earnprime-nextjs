'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './NavHeader.module.css'

export default function NavHeader() {
  const router = useRouter()
  const [productsOpen, setProductsOpen] = useState(false)
  const [calcOpen, setCalcOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <EPContainer maxWidth="xl">
        <div className={styles.navContent}>
          <Link href="/" className={styles.navLogo}>
            <img
              src="/assets/Logo files/PNGs - SVGs/SVG/Asset 3.svg"
              alt="EarnPrime Logo"
              className={styles.navLogoImage}
            />
          </Link>
          <div className={styles.navLinks}>
            <div
              className={styles.navDropdown}
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <span className={styles.navDropdownTrigger}>
                Products {productsOpen ? '▴' : '▾'}
              </span>
              {productsOpen && (
                <div className={styles.navDropdownMenu}>
                  <Link href="/products/short-term-notes">Short Term Notes</Link>
                  <Link href="/products/preferred-equity">Preferred Equity</Link>
                </div>
              )}
            </div>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/about">About Us</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/blog">Blog</Link>
            <div
              className={styles.navDropdown}
              onMouseEnter={() => setCalcOpen(true)}
              onMouseLeave={() => setCalcOpen(false)}
            >
              <span className={styles.navDropdownTrigger}>
                Calculators {calcOpen ? '▴' : '▾'}
              </span>
              {calcOpen && (
                <div className={styles.navDropdownMenu}>
                  <Link href="/calculator">Investment Calculator</Link>
                  <Link href="/calculator/mortgage">Mortgage Calculator</Link>
                  <Link href="/calculator/loan">Loan Calculator</Link>
                </div>
              )}
            </div>
          </div>
          <div className={styles.navActions}>
            <EPButton size="sm" variant="outline" onClick={() => router.push('/login')}>
              Login
            </EPButton>
            <EPButton size="sm" onClick={() => router.push('/register')}>
              Sign Up
            </EPButton>
          </div>
        </div>
      </EPContainer>
    </nav>
  )
}
