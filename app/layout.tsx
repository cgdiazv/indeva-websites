import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// This pulls in Montserrat and optimizes it
const montserrat = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Indeva Websites | Web Design & Hosting',
  description: 'Professional web design services and robust hosting solutions.',
  icons: {
    icon: '/logo-indeva.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The suppressHydrationWarning goes directly on the html tag below
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}