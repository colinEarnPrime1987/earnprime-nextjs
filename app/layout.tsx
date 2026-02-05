import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EarnPrime - Invest in Your Prime',
  description: 'Secure, transparent short-term investment notes designed to help you grow your wealth with confidence. Competitive rates up to 6.70% APY.',
  keywords: 'investment, short-term notes, financial growth, secure investing, high returns',
  openGraph: {
    title: 'EarnPrime - Invest in Your Prime',
    description: 'Secure, transparent short-term investment notes with competitive rates up to 6.70% APY.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
