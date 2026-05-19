'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const GA_ID = 'G-LNFEHR878Q'

const pageview = (url: string) => {
  if (typeof window === 'undefined') return
  const gtag = (window as any).gtag
  if (typeof gtag !== 'function') return
  gtag('config', GA_ID, {
    page_path: url,
  })
}

export default function Analytics() {
  const pathname = usePathname()

  useEffect(() => {
    pageview(pathname)
  }, [pathname])

  return null
}
