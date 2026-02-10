'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import styles from './form-crs.module.css'

export default function FormCRSPage() {
  const router = useRouter()

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
          <h1 className={styles.heroTitle}>Form CRS - Client Relationship Summary</h1>
          <p className={styles.heroSubtitle}>Last Updated: {new Date().toLocaleDateString()}</p>
        </EPContainer>
      </section>

      <section className={styles.content}>
        <EPContainer maxWidth="lg">
          <div className={styles.legalContent}>
            <div className={styles.section}>
              <h2>Introduction</h2>
              <p>
                EarnPrime Securities, LLC (&quot;EarnPrime&quot;) is registered with the Securities and Exchange Commission (SEC)
                as a broker-dealer and is a member of the Financial Industry Regulatory Authority (FINRA) and the
                Securities Investor Protection Corporation (SIPC). Brokerage and investment advisory services and fees
                differ, and it is important for you to understand the differences.
              </p>
              <p>
                Free and simple tools are available to research firms and financial professionals at
                investor.gov/CRS, which also provides educational materials about broker-dealers, investment advisers,
                and investing.
              </p>
            </div>

            <div className={styles.section}>
              <h2>What investment services and advice can you provide me?</h2>
              <p>
                We offer self-directed brokerage services to retail investors. Our services include the ability to buy
                and sell securities, including equities and exchange-traded funds (ETFs), through our online platform.
                We do not provide investment recommendations or ongoing monitoring of your account.
              </p>
              <ul>
                <li>We do not offer proprietary products</li>
                <li>There is no minimum account balance required to open an account</li>
                <li>You make all investment decisions for your account</li>
                <li>We do not limit the types of investments available to you within our offered products</li>
              </ul>
              <p>
                <strong>Ask your financial professional:</strong> Given my financial situation, should I choose a
                brokerage service? Why or why not? How will you choose investments to recommend to me? What is your
                relevant experience, including your licenses, education, and other qualifications?
              </p>
            </div>

            <div className={styles.section}>
              <h2>What fees will I pay?</h2>
              <p>
                We offer commission-free trading on U.S.-listed equities and ETFs. However, you will be charged
                certain regulatory fees including:
              </p>
              <ul>
                <li>SEC fees on sell transactions</li>
                <li>FINRA Trading Activity Fee (TAF)</li>
                <li>Wire transfer fees for outgoing transfers</li>
                <li>Other fees as described in our Fee Schedule</li>
              </ul>
              <p>
                You will pay fees and costs whether you make or lose money on your investments. Fees and costs will
                reduce any amount of money you make on your investments over time. Please make sure you understand
                what fees and costs you are paying.
              </p>
              <p>
                <strong>Ask your financial professional:</strong> Help me understand how these fees and costs might
                affect my investments. If I give you $10,000 to invest, how much will go to fees and costs, and how
                much will be invested for me?
              </p>
            </div>

            <div className={styles.section}>
              <h2>What are your legal obligations to me when providing recommendations?</h2>
              <p>
                When we provide you with a recommendation, we have to act in your best interest and not put our interest
                ahead of yours. At the same time, the way we make money creates some conflicts with your interests. You
                should understand and ask us about these conflicts because they can affect the recommendations we provide
                you.
              </p>
              <p>
                <strong>Ask your financial professional:</strong> How might your conflicts of interest affect me, and
                how will you address them?
              </p>
            </div>

            <div className={styles.section}>
              <h2>How do your financial professionals make money?</h2>
              <p>
                Our financial professionals receive a salary and may receive bonuses based on the overall success of
                the firm. They do not receive commissions or compensation based on the products they sell or the
                trading activity in your account.
              </p>
            </div>

            <div className={styles.section}>
              <h2>Do you or your financial professionals have legal or disciplinary history?</h2>
              <p>
                No. Visit investor.gov/CRS to research our firm and our financial professionals using FINRA
                BrokerCheck.
              </p>
              <p>
                <strong>Ask your financial professional:</strong> As a financial professional, do you have any
                disciplinary history? For what type of conduct?
              </p>
            </div>

            <div className={styles.section}>
              <h2>Additional Information</h2>
              <p>
                For additional information about our services, visit our website or contact us directly. If you
                would like additional, up-to-date information or a copy of this disclosure, please contact us:
              </p>
              <ul>
                <li>Email: compliance@earnprime.com</li>
                <li>Phone: 1-800-EARN-PRIME</li>
                <li>Mail: 123 Financial District, New York, NY 10004</li>
              </ul>
              <p>
                <strong>Ask your financial professional:</strong> Who is my primary contact person? Is he or she a
                representative of an investment adviser or a broker-dealer? Who can I talk to if I have concerns about
                how this person is treating me?
              </p>
            </div>
          </div>
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
