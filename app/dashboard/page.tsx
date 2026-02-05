'use client'

import AnimatedBackground from '@/components/base/AnimatedBackground'
import AnimatedLogo from '@/components/base/AnimatedLogo'
import EPButton from '@/components/base/EPButton'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './dashboard.module.css'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, verify session and fetch user data
    // For now, just simulate loading
    const timer = setTimeout(() => {
      setUser({ username: 'Demo User' })
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleLogout = async () => {
    // Clear session
    document.cookie = 'sessionId=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    router.push('/login')
  }

  if (loading) {
    return (
      <div className={styles.dashboardPage}>
        <AnimatedBackground />
        <div className={styles.loadingContainer}>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboardPage}>
      <AnimatedBackground />

      <div className={styles.dashboardContainer}>
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            <AnimatedLogo width={150} height={100} />
          </div>

          <EPButton onClick={handleLogout} variant="outline">
            Logout
          </EPButton>
        </header>

        <main className={styles.main}>
          <div className={styles.welcomeCard}>
            <h1 className={styles.title}>Welcome to EarnPrime!</h1>
            <p className={styles.subtitle}>Your dashboard is under construction</p>

            <div className={styles.comingSoonSection}>
              <h2 className={styles.sectionTitle}>Phase 2 Features Coming Soon:</h2>
              <ul className={styles.featureList}>
                <li>✓ Digital Wallet View</li>
                <li>✓ Cash Balance Display</li>
                <li>✓ Currently Held Notes</li>
                <li>✓ Buy Notes Interface</li>
              </ul>
            </div>

            <div className={styles.demoInfo}>
              <p className={styles.demoText}>🎉 Phase 1 Complete: Authentication & Registration</p>
              <p className={styles.demoSubtext}>
                You successfully logged in! Check the Phase 1 documentation for implementation details.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
