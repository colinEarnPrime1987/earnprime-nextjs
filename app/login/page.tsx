'use client'

import AnimatedBackground from '@/components/base/AnimatedBackground'
import AnimatedLogo from '@/components/base/AnimatedLogo'
import EPButton from '@/components/base/EPButton'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './login.module.css'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Redirect to dashboard on success
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.loginPage}>
      <AnimatedBackground />

      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.logoContainer}>
            <Link href="/" aria-label="Back to home">
              <AnimatedLogo width={300} height={200} />
            </Link>
          </div>

          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your account</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>
                Username or Email
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                className={styles.input}
                required
                autoComplete="username"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className={styles.input}
                required
                autoComplete="current-password"
              />
            </div>

            <div className={styles.forgotPassword}>
              <Link href="/forgot-password" className={styles.link}>
                Forgot password?
              </Link>
            </div>

            <EPButton type="submit" fullWidth disabled={loading} className={styles.submitButton}>
              {loading ? 'Signing in...' : 'Sign In'}
            </EPButton>
          </form>

          <div className={styles.mfaNote}>
            <p className={styles.noteText}>🔒 Multi-factor authentication will be required after initial setup</p>
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerText}>or</span>
          </div>

          <div className={styles.registerSection}>
            <p className={styles.registerText}>
              Don't have an account?{' '}
              <Link href="/register" className={styles.registerLink}>
                Create an account
              </Link>
            </p>
          </div>

          <div className={styles.futureFeatures}>
            <p className={styles.futureText}>Coming soon:</p>
            <button className={styles.ssoButton} disabled>
              <span className={styles.ssoIcon}>G</span>
              Continue with Google
            </button>
            <button className={styles.ssoButton} disabled>
              <span className={styles.ssoIcon}></span>
              Continue with Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
