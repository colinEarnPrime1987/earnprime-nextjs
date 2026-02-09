'use client'

import AnimatedBackground from '@/components/base/AnimatedBackground'
import AnimatedLogo from '@/components/base/AnimatedLogo'
// TODO: Re-enable when email/password login is restored
// import EPButton from '@/components/base/EPButton'
import Link from 'next/link'
// TODO: Re-enable useRouter when email/password login is restored
import { useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Suspense } from 'react'
import styles from './login.module.css'

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

function LoginContent() {
  // const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const authError = searchParams.get('error')
  const error = authError === 'AccessDenied' ? 'Only @earnprime.org accounts are allowed.' : ''

  // TODO: Re-enable email/password login when ready for production
  // const [formData, setFormData] = useState({
  //   username: '',
  //   password: '',
  // })
  // const [error, setError] = useState(
  //   authError === 'AccessDenied' ? 'Only @earnprime.org accounts are allowed.' : ''
  // )
  // const [loading, setLoading] = useState(false)
  //
  // const handleSubmit = async (e: React.SubmitEvent) => {
  //   e.preventDefault()
  //   setError('')
  //   setLoading(true)
  //
  //   try {
  //     const response = await fetch('/api/auth/login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(formData),
  //     })
  //
  //     const data = await response.json()
  //
  //     if (!response.ok) {
  //       throw new Error(data.error || 'Login failed')
  //     }
  //
  //     router.push(callbackUrl)
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'An error occurred')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  return (
    <div className={styles.loginPage}>
      <AnimatedBackground />

      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className={styles.logoContainer}>
            <AnimatedLogo width={300} height={200} />
          </div>

          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in with your EarnPrime workspace account</p>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.ssoSection}>
            <button
              className={styles.ssoButton}
              onClick={() => signIn('google', { callbackUrl })}
              type="button"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </div>

          {/* TODO: Re-enable when ready for production
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

          <button className={styles.ssoButton} disabled>
            <span className={styles.ssoIcon}></span>
            Continue with Apple
            <span className={styles.comingSoon}>Coming soon</span>
          </button>
          */}
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
