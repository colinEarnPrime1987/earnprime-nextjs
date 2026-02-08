'use client'

import AnimatedBackground from '@/components/base/AnimatedBackground'
import AnimatedLogo from '@/components/base/AnimatedLogo'
import EPButton from '@/components/base/EPButton'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './register.module.css'

interface RegistrationForm {
  // Personal Information
  firstName: string
  middleName: string
  lastName: string
  suffix: string
  dob: string
  ssn: string

  // Contact Information
  email: string
  phone: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  zipCode: string

  // Account Credentials
  username: string
  password: string
  confirmPassword: string

  // Financial Information
  netWorth: string
  householdIncome: string
  maritalStatus: string
  accreditedInvestor: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<RegistrationForm>({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    dob: '',
    ssn: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    username: '',
    password: '',
    confirmPassword: '',
    netWorth: '',
    householdIncome: '',
    maritalStatus: 'single',
    accreditedInvestor: false,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Auto-check accredited investor status
  const checkAccreditedStatus = (income: string, netWorth: string, maritalStatus: string) => {
    const singleQualified = maritalStatus === 'single' && ['$200k-$250k', '$250k-$300k', '$300k+'].includes(income)
    const marriedQualified = maritalStatus === 'married' && ['$300k+'].includes(income)
    const netWorthQualified = ['$1M+'].includes(netWorth)

    return singleQualified || marriedQualified || netWorthQualified
  }

  const handleInputChange = (field: keyof RegistrationForm, value: string | boolean) => {
    const updated = { ...formData, [field]: value }

    // Auto-check accredited investor
    if (field === 'householdIncome' || field === 'netWorth' || field === 'maritalStatus') {
      const isAccredited = checkAccreditedStatus(updated.householdIncome, updated.netWorth, updated.maritalStatus)
      updated.accreditedInvestor = isAccredited
    }

    setFormData(updated)
  }

  const validateStep = (step: number): boolean => {
    setError('')

    switch (step) {
      case 1: // Personal Info
        if (!formData.firstName || !formData.lastName || !formData.dob || !formData.ssn) {
          setError('Please fill in all required fields')
          return false
        }
        if (formData.ssn.replace(/-/g, '').length !== 9) {
          setError('SSN must be 9 digits')
          return false
        }
        return true

      case 2: // Contact Info
        if (
          !formData.email ||
          !formData.phone ||
          !formData.addressLine1 ||
          !formData.city ||
          !formData.state ||
          !formData.zipCode
        ) {
          setError('Please fill in all required fields')
          return false
        }
        if (!formData.email.includes('@')) {
          setError('Please enter a valid email')
          return false
        }
        return true

      case 3: // Financial Info
        if (!formData.netWorth || !formData.householdIncome || !formData.maritalStatus) {
          setError('Please fill in all required fields')
          return false
        }
        return true

      case 4: // Account Setup
        if (!formData.username || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all required fields')
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match')
          return false
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters')
          return false
        }
        return true

      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setError('')
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(4)) return

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

      // Redirect to login on success
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
          <p className={styles.subtitle}>Step {currentStep} of 4</p>

          {/* Progress Bar */}
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(currentStep / 4) * 100}%` }} />
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className={styles.step}>
                <h2 className={styles.stepTitle}>Personal Information</h2>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={e => handleInputChange('firstName', e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Middle Name</label>
                    <input
                      type="text"
                      value={formData.middleName}
                      onChange={e => handleInputChange('middleName', e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={e => handleInputChange('lastName', e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Suffix</label>
                    <select
                      value={formData.suffix}
                      onChange={e => handleInputChange('suffix', e.target.value)}
                      className={styles.input}
                    >
                      <option value="">None</option>
                      <option value="Jr.">Jr.</option>
                      <option value="Sr.">Sr.</option>
                      <option value="II">II</option>
                      <option value="III">III</option>
                      <option value="IV">IV</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Date of Birth *</label>
                    <input
                      type="date"
                      value={formData.dob}
                      onChange={e => handleInputChange('dob', e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Social Security Number *</label>
                    <input
                      type="text"
                      placeholder="XXX-XX-XXXX"
                      value={formData.ssn}
                      onChange={e => handleInputChange('ssn', e.target.value)}
                      className={styles.input}
                      maxLength={11}
                      required
                    />
                    <small className={styles.helpText}>Required for IRS reporting</small>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div className={styles.step}>
                <h2 className={styles.stepTitle}>Contact Information</h2>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="(XXX) XXX-XXXX"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Address Line 1 *</label>
                  <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={e => handleInputChange('addressLine1', e.target.value)}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Address Line 2</label>
                  <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={e => handleInputChange('addressLine2', e.target.value)}
                    className={styles.input}
                    placeholder="Apt, Suite, Unit, etc."
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={e => handleInputChange('city', e.target.value)}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>State *</label>
                    <select
                      value={formData.state}
                      onChange={e => handleInputChange('state', e.target.value)}
                      className={styles.input}
                      required
                    >
                      <option value="">Select State</option>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      {/* Add all states - abbreviated for brevity */}
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>ZIP Code *</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={e => handleInputChange('zipCode', e.target.value)}
                      className={styles.input}
                      maxLength={5}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Financial Information */}
            {currentStep === 3 && (
              <div className={styles.step}>
                <h2 className={styles.stepTitle}>Financial Information</h2>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Net Worth *</label>
                  <select
                    value={formData.netWorth}
                    onChange={e => handleInputChange('netWorth', e.target.value)}
                    className={styles.input}
                    required
                  >
                    <option value="">Select Range</option>
                    <option value="$0-$100k">$0 - $100,000</option>
                    <option value="$100k-$250k">$100,000 - $250,000</option>
                    <option value="$250k-$500k">$250,000 - $500,000</option>
                    <option value="$500k-$1M">$500,000 - $1,000,000</option>
                    <option value="$1M+">$1,000,000+</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Household Income *</label>
                  <select
                    value={formData.householdIncome}
                    onChange={e => handleInputChange('householdIncome', e.target.value)}
                    className={styles.input}
                    required
                  >
                    <option value="">Select Range</option>
                    <option value="$50k-$100k">$50,000 - $100,000</option>
                    <option value="$100k-$150k">$100,000 - $150,000</option>
                    <option value="$150k-$200k">$150,000 - $200,000</option>
                    <option value="$200k-$250k">$200,000 - $250,000</option>
                    <option value="$250k-$300k">$250,000 - $300,000</option>
                    <option value="$300k+">$300,000+</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Marital Status *</label>
                  <select
                    value={formData.maritalStatus}
                    onChange={e => handleInputChange('maritalStatus', e.target.value)}
                    className={styles.input}
                    required
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                  </select>
                </div>

                <div className={styles.accreditedSection}>
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="accredited"
                      checked={formData.accreditedInvestor}
                      onChange={e => handleInputChange('accreditedInvestor', e.target.checked)}
                      className={styles.checkbox}
                      disabled={checkAccreditedStatus(
                        formData.householdIncome,
                        formData.netWorth,
                        formData.maritalStatus
                      )}
                    />
                    <label htmlFor="accredited" className={styles.checkboxLabel}>
                      Accredited Investor
                    </label>
                  </div>
                  <p className={styles.accreditedInfo}>
                    {checkAccreditedStatus(formData.householdIncome, formData.netWorth, formData.maritalStatus)
                      ? '✓ You qualify as an accredited investor based on your income and/or net worth.'
                      : 'An accredited investor has income over $200k (single) or $300k (married), or net worth over $1M.'}
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Account Setup */}
            {currentStep === 4 && (
              <div className={styles.step}>
                <h2 className={styles.stepTitle}>Account Setup</h2>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Username *</label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={e => handleInputChange('username', e.target.value)}
                    className={styles.input}
                    required
                    autoComplete="username"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Password *</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={e => handleInputChange('password', e.target.value)}
                    className={styles.input}
                    required
                    autoComplete="new-password"
                  />
                  <small className={styles.helpText}>Minimum 8 characters</small>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Confirm Password *</label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                    className={styles.input}
                    required
                    autoComplete="new-password"
                  />
                </div>

                <div className={styles.termsSection}>
                  <p className={styles.termsText}>
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={styles.buttonGroup}>
              {currentStep > 1 && (
                <EPButton type="button" variant="outline" onClick={handleBack} disabled={loading}>
                  Back
                </EPButton>
              )}

              {currentStep < 4 ? (
                <EPButton type="button" onClick={handleNext} fullWidth={currentStep === 1}>
                  Next
                </EPButton>
              ) : (
                <EPButton type="submit" disabled={loading} fullWidth>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </EPButton>
              )}
            </div>
          </form>

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
