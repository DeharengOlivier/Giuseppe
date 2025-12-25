'use client'

import { usePathname } from 'next/navigation'
import { Navbar, Footer } from './Layout'
import { ReactNode } from 'react'

export function PublicLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  
  // Déterminer si on est sur une route publique
  const isPublicRoute = !pathname.startsWith('/admin')

  if (!isPublicRoute) {
    // Route admin : pas de navbar/footer
    return <>{children}</>
  }

  // Route publique : avec navbar/footer
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
