import type { Metadata } from 'next'
import Providers from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'EarnPrime - Short-Term Notes | An Alternative to High Yield CDs',
  description: 'Looking for high yield CD rates or jumbo CD alternatives? EarnPrime offers short-term investment notes with rates up to 6.70% APY.',
  keywords: 'high yield cd alternative, jumbo cd rates, high yield cd, short-term notes, cd alternative, best cd rates, secure investing, investment notes, high returns, financial growth',
  openGraph: {
    title: 'EarnPrime - Short-Term Notes | An Alternative to High Yield CDs',
    description: 'Looking for high yield CD or jumbo CD alternatives? EarnPrime offers short-term investment notes with rates up to 6.70% APY.',
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
      <body><Providers>{children}</Providers></body>
    </html>
  )
}
