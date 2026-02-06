'use client'

import EPButton from '@/components/base/EPButton'
import EPContainer from '@/components/layout/EPContainer'
import { useRouter } from 'next/navigation'
import styles from './blog.module.css'

export default function BlogPage() {
  const router = useRouter()

  const blogPosts = [
    {
      title: '5 Strategies for Short-Term Investment Success',
      category: 'Investment Tips',
      date: 'January 15, 2026',
      excerpt:
        'Discover proven strategies to maximize returns on short-term investments while managing risk effectively.',
      readTime: '5 min read',
    },
    {
      title: 'Understanding Investment Note Ratings',
      category: 'Education',
      date: 'January 10, 2026',
      excerpt:
        'Learn how to interpret risk ratings and make informed decisions about which investment notes align with your goals.',
      readTime: '7 min read',
    },
    {
      title: 'Market Update: Q4 2025 Performance Review',
      category: 'Market Insights',
      date: 'January 5, 2026',
      excerpt:
        'A comprehensive review of Q4 2025 market trends and what they mean for short-term investors in 2026.',
      readTime: '10 min read',
    },
    {
      title: 'Tax-Efficient Investing with Short-Term Notes',
      category: 'Tax Planning',
      date: 'December 28, 2025',
      excerpt:
        'Maximize your after-tax returns with these tax-efficient strategies for short-term investment notes.',
      readTime: '6 min read',
    },
    {
      title: 'Diversification: Building a Balanced Portfolio',
      category: 'Investment Tips',
      date: 'December 20, 2025',
      excerpt:
        'Learn how to diversify across different note types, terms, and risk levels to optimize your portfolio.',
      readTime: '8 min read',
    },
    {
      title: 'EarnPrime Product Update: New Features for 2026',
      category: 'Company News',
      date: 'December 15, 2025',
      excerpt:
        "Exciting new features coming to EarnPrime in 2026, including auto-reinvestment and advanced portfolio analytics.",
      readTime: '4 min read',
    },
  ]

  const categories = ['All Posts', 'Investment Tips', 'Education', 'Market Insights', 'Tax Planning', 'Company News']

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
          <h1 className={styles.heroTitle}>EarnPrime Blog</h1>
          <p className={styles.heroSubtitle}>
            Investment insights, market updates, and educational content to help you grow your wealth
          </p>
        </EPContainer>
      </section>

      <section className={styles.blog}>
        <EPContainer maxWidth="lg">
          <div className={styles.categories}>
            {categories.map((category, index) => (
              <button key={index} className={`${styles.categoryButton} ${index === 0 ? styles.active : ''}`}>
                {category}
              </button>
            ))}
          </div>

          <div className={styles.postsGrid}>
            {blogPosts.map((post, index) => (
              <article key={index} className={styles.postCard}>
                <div className={styles.postCategory}>{post.category}</div>
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postExcerpt}>{post.excerpt}</p>
                <div className={styles.postMeta}>
                  <span className={styles.postDate}>{post.date}</span>
                  <span className={styles.postDivider}>•</span>
                  <span className={styles.postReadTime}>{post.readTime}</span>
                </div>
                <EPButton variant="outline" size="sm">
                  Read More
                </EPButton>
              </article>
            ))}
          </div>
        </EPContainer>
      </section>

      <section className={styles.newsletter}>
        <EPContainer maxWidth="lg">
          <h2 className={styles.newsletterTitle}>Subscribe to Our Newsletter</h2>
          <p className={styles.newsletterSubtitle}>
            Get the latest investment insights and market updates delivered to your inbox weekly
          </p>
          <div className={styles.newsletterForm}>
            <input type="email" placeholder="Enter your email" className={styles.newsletterInput} />
            <EPButton size="lg">Subscribe</EPButton>
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
