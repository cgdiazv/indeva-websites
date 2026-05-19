import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Analytics from '@/components/Analytics'

// This pulls in Montserrat and optimizes it
const montserrat = Montserrat({ subsets: ['latin'] })
const GA_ID = 'G-LNFEHR878Q'

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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });`}
        </Script>

        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}