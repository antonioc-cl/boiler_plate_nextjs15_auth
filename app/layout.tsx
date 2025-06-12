import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Next.js 15 Boilerplate',
  description:
    'Production-ready Next.js 15 boilerplate with TypeScript and authentication',
  keywords: ['Next.js', 'React', 'TypeScript', 'Boilerplate'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Company',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Next.js 15 Boilerplate',
    title: 'Next.js 15 Boilerplate',
    description:
      'Production-ready Next.js 15 boilerplate with TypeScript and authentication',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js 15 Boilerplate',
    description:
      'Production-ready Next.js 15 boilerplate with TypeScript and authentication',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
