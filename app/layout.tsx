import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Indeva Websites | Web Design & Hosting',
  description: 'Professional web design, robust hosting solutions, and reseller services.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The suppressHydrationWarning goes directly on the html tag below
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}