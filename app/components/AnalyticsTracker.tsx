'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function AnalyticsTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Ne pas traquer les pages admin
    if (pathname.startsWith('/admin')) {
      console.log('🚫 Analytics: Skipping admin page:', pathname)
      return
    }

    console.log('📊 Analytics: Tracking visit to:', pathname)

    // Envoyer la visite à l'API
    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: pathname,
      }),
    })
      .then(response => {
        if (response.ok) {
          console.log('✅ Analytics: Visit tracked successfully')
        } else {
          console.error('❌ Analytics: Failed to track visit, status:', response.status)
        }
      })
      .catch(err => {
        console.error('❌ Analytics: Error tracking visit:', err)
      })
  }, [pathname])

  return null
}
