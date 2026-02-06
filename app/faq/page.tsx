'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import styles from './faq.module.css'

export default function FAQPage() {
  const router = useRouter()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Creating an account is simple! Click the "Get Started" button, complete our multi-step registration process with your personal and financial information, and verify your identity. The entire process takes about 5-10 minutes.',
        },
        {
          q: 'What is the minimum investment amount?',
          a: 'The minimum investment amount is $1,000 per note. This allows us to provide competitive returns while maintaining accessibility for a wide range of investors.',
        },
        {
          q: 'How long does it take to get started?',
          a: 'Once your account is verified, you can start investing immediately. Account verification typically takes 1-2 business days.',
        },
      ],
    },
    {
      category: 'Investments',
      questions: [
        {
          q: 'What types of investment notes do you offer?',
          a: 'We offer short-term investment notes with terms ranging from 90 to 270 days. Each note is backed by carefully vetted assets and provides transparent risk ratings and expected returns.',
        },
        {
          q: 'What are the expected returns?',
          a: 'Returns vary by note type and term length, typically ranging from 5% to 8% APY. Higher returns generally correspond with longer terms and different risk profiles.',
        },
        {
          q: 'Can I withdraw my investment early?',
          a: 'Early withdrawals are subject to terms specified in each note. Some notes allow early withdrawal with penalties, while others require holding until maturity.',
        },
      ],
    },
    {
      category: 'Security & Account',
      questions: [
        {
          q: 'How is my personal information protected?',
          a: 'We use bank-level 256-bit SSL encryption, multi-factor authentication, and comply with all relevant data protection regulations. Your information is stored securely and never shared without your consent.',
        },
        {
          q: 'Are my investments insured?',
          a: 'Investment notes are subject to market risks and are not FDIC insured. However, we conduct rigorous due diligence on all investment opportunities and provide transparent risk assessments.',
        },
        {
          q: 'How do I reset my password?',
          a: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to securely reset your password.',
        },
      ],
    },
    {
      category: 'Payments & Withdrawals',
      questions: [
        {
          q: 'How do I fund my account?',
          a: 'You can fund your account via ACH bank transfer or wire transfer. ACH transfers are free and take 3-5 business days, while wire transfers are processed within 24 hours.',
        },
        {
          q: 'How long do withdrawals take?',
          a: 'Withdrawals via ACH typically take 3-5 business days. Wire transfers are processed within 1-2 business days but may incur fees.',
        },
        {
          q: 'Are there any fees?',
          a: 'There are no fees for account creation, ACH deposits, or standard withdrawals. We may charge fees for expedited wire transfers or early withdrawal penalties as disclosed in each note\'s terms.',
        },
      ],
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
          <h1 className={styles.heroTitle}>Frequently Asked Questions</h1>
          <p className={styles.heroSubtitle}>
            Find answers to common questions about investing with EarnPrime
          </p>
        </EPContainer>
      </section>

      <section className={styles.faqSection}>
        <EPContainer maxWidth="lg">
          {faqs.map((category, catIndex) => (
            <div key={catIndex} className={styles.faqCategory}>
              <h2 className={styles.categoryTitle}>{category.category}</h2>
              <div className={styles.questionsList}>
                {category.questions.map((faq, qIndex) => {
                  const index = catIndex * 100 + qIndex
                  const isOpen = openIndex === index
                  return (
                    <div key={index} className={styles.faqItem}>
                      <button className={styles.question} onClick={() => toggleQuestion(index)}>
                        <span>{faq.q}</span>
                        <span className={`${styles.icon} ${isOpen ? styles.iconOpen : ''}`}>▼</span>
                      </button>
                      {isOpen && <div className={styles.answer}>{faq.a}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </EPContainer>
      </section>

      <section className={styles.cta}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.ctaTitle}>Still Have Questions?</h2>
          <p className={styles.ctaSubtitle}>Our support team is here to help</p>
          <EPButton size="lg" onClick={() => router.push('/contact')}>
            Contact Support
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
