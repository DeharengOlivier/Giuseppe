'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { pageEvents, PageEvent } from '@/app/lib/pageEvents'

export interface Page {
  id: string
  title: string
  slug: string
  type: string
  icon?: string
  order: number
  showInNav: boolean
  showInFooter: boolean
}

interface PagesContextType {
  pages: Page[]
  navPages: Page[]
  footerPages: Page[]
  loading: boolean
  refreshPages: () => Promise<void>
}

const PagesContext = createContext<PagesContextType | undefined>(undefined)

export function PagesProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/pages?public=true')
      if (response.ok) {
        const data = await response.json()
        setPages(data)
      }
    } catch (error) {
      console.error('Erreur chargement pages:', error)
    } finally {
      setLoading(false)
    }
  }

  // Chargement initial
  useEffect(() => {
    fetchPages()
  }, [])

  // Écouter les événements de changement
  useEffect(() => {
    const unsubscribe = pageEvents.on((event: PageEvent) => {
      console.log('📄 Page event:', event.type, event.slug)
      // Rafraîchir les pages quand il y a un changement
      fetchPages()
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const navPages = pages.filter(p => p.showInNav).sort((a, b) => a.order - b.order)
  const footerPages = pages.filter(p => p.showInFooter).sort((a, b) => a.order - b.order)

  return (
    <PagesContext.Provider
      value={{
        pages,
        navPages,
        footerPages,
        loading,
        refreshPages: fetchPages,
      }}
    >
      {children}
    </PagesContext.Provider>
  )
}

export function usePages() {
  const context = useContext(PagesContext)
  if (context === undefined) {
    throw new Error('usePages must be used within a PagesProvider')
  }
  return context
}
