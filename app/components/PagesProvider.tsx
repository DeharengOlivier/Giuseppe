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

export interface PagesContextType {
  pages: Page[]
  navPages: Page[]
  footerPages: Page[]
  siteContent: Record<string, string>
  loading: boolean
  refreshPages: () => Promise<void>
}

const PagesContext = createContext<PagesContextType | undefined>(undefined)

export function PagesProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<Page[]>([])
  const [siteContent, setSiteContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      // Fetch Pages
      const pagesRes = await fetch('/api/pages?public=true')
      if (pagesRes.ok) {
        const data = await pagesRes.json()
        setPages(data)
      }

      // Fetch Content (for site name etc)
      const contentRes = await fetch('/api/page-content')
      if (contentRes.ok) {
        const data = await contentRes.json()
        setSiteContent(data)
      }

    } catch (error) {
      console.error('Erreur chargement données:', error)
    } finally {
      setLoading(false)
    }
  }

  // Chargement initial
  useEffect(() => {
    fetchData()
  }, [])

  // Écouter les événements de changement
  useEffect(() => {
    const unsubscribe = pageEvents.on((event: PageEvent) => {
      console.log('📄 Page event:', event.type, event.slug)
      fetchData()
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
        siteContent,
        loading,
        refreshPages: fetchData,
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
