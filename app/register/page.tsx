import { redirect } from 'next/navigation'

// TODO: Re-enable full registration page when ready for production.
// The original RegisterContent component with email/password signup,
// Google OAuth, Apple (coming soon), and legal agreement checkbox
// is preserved below in a comment block for easy restoration.

export default function RegisterPage() {
  // Registration disabled — only Google Workspace SSO is active
  redirect('/login')
}

/* ORIGINAL REGISTRATION PAGE — restore when ready for production

'use client'

import AnimatedBackground from '@/components/base/AnimatedBackground'
import AnimatedLogo from '@/components/base/AnimatedLogo'
import EPButton from '@/components/base/EPButton'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Suspense, useState } from 'react'
import styles from './register.module.css'

function GoogleIcon() {
  return (
    <svg className={styles.googleIcon} viewBox="0 0 24 24" width="20" height="20">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function RegisterContent() {
  const router = useRouter()
  const [agreed, setAgreed] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email')
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      router.push('/login?registered=true')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.registerPage}>
      <AnimatedBackground />

      <div className={styles.registerContainer}>
        <div className={styles.registerCard}>
          <div className={styles.logoContainer}>
            <Link href="/" aria-label="Back to home">
              <AnimatedLogo width={250} height={175} />
            </Link>
          </div>

          <h1 className={styles.title}>Create Your Account</h1>
          <p className={styles.subtitle}>Get started with EarnPrime</p>

          <div className={styles.agreementSection}>
            <label className={styles.agreementLabel}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className={styles.agreementCheckbox}
              />
              <span className={styles.agreementText}>
                I have read and agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" className={styles.agreementLink}>Terms of Service</a>,{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className={styles.agreementLink}>Privacy Policy</a>,{' '}
                <a href="/disclosures/electronic-consent" target="_blank" rel="noopener noreferrer" className={styles.agreementLink}>Electronic Disclosure & Consent</a>,{' '}
                <a href="/disclosures/brokerage-agreement" target="_blank" rel="noopener noreferrer" className={styles.agreementLink}>Limited Brokerage Services Agreement</a>, and{' '}
                <a href="/disclosures/form-crs" target="_blank" rel="noopener noreferrer" className={styles.agreementLink}>Form CRS</a>.
              </span>
            </label>
          </div>

          {!showEmailForm ? (
            <div className={styles.ssoSection}>
              <button
                className={styles.ssoButton}
                onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
                type="button"
                disabled={!agreed}
              >
                <GoogleIcon />
                Continue with Google
              </button>

              <button className={styles.ssoButton} disabled>
                <span className={styles.ssoIcon}></span>
                Continue with Apple
                <span className={styles.comingSoon}>Coming soon</span>
              </button>

              <button
                className={styles.ssoButton}
                onClick={() => setShowEmailForm(true)}
                type="button"
                disabled={!agreed}
              >
                Continue with Email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Legal First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className={styles.input}
                    required
                    autoComplete="given-name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Legal Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className={styles.input}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className={styles.input}
                  required
                  autoComplete="email"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  className={styles.input}
                  required
                  autoComplete="new-password"
                />
              </div>

              <div className={styles.buttonGroup}>
                <EPButton
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEmailForm(false)
                    setError('')
                  }}
                  disabled={loading}
                >
                  Back
                </EPButton>

                <EPButton type="submit" disabled={loading} fullWidth>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </EPButton>
              </div>
            </form>
          )}

          <div className={styles.loginSection}>
            <p className={styles.loginText}>
              Already have an account?{' '}
              <Link href="/login" className={styles.loginLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  )
}

*/
