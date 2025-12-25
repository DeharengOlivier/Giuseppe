'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, FileText, Calendar, Star, Users, Info } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePages } from './PagesProvider'

const iconMap: Record<string, any> = {
  Home,
  Briefcase,
  FileText,
  Calendar,
  Star,
  Users,
  Info,
}

export function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const { navPages, loading } = usePages()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/articles', label: 'Articles', icon: FileText },
    ...navPages.map(page => ({
      href: `/${page.slug}`,
      label: page.title,
      icon: page.icon ? iconMap[page.icon] : null,
    })),
  ]

  if (loading) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
        <nav className="bg-theme-alt border border-theme-main rounded-full shadow-theme-md backdrop-blur-sm">
          <div className="px-4 py-2">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-2 px-4 py-1.5">
                <Home className="w-3.5 h-3.5" />
                <span className="text-sm">Chargement...</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 px-4">
      <nav 
        className={`
          bg-theme-alt border border-theme-main rounded-full 
          transition-all duration-300 ease-out
          ${scrolled 
            ? 'shadow-theme-lg backdrop-blur-md' 
            : 'shadow-theme-md backdrop-blur-sm'
          }
        `}
      >
        <div className="px-4 py-2">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const isHome = item.href === '/'
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-2 px-4 py-1.5 rounded-full font-medium text-sm
                    whitespace-nowrap transition-theme
                    ${
                      isActive
                        ? 'text-theme-primary'
                        : 'text-theme-secondary hover:text-theme-primary'
                    }
                  `}
                >
                  {isHome && <Home className="w-3.5 h-3.5" />}
                  <span className={isActive ? 'font-semibold' : ''}>
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}

export function Footer() {
  const { footerPages } = usePages()

  return (
    <footer className="bg-theme-alt border-t border-theme-main mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {footerPages.length > 0 && (
            <div className="mb-6 flex flex-wrap justify-center gap-4">
              {footerPages.map(page => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className="text-theme-secondary hover:text-theme-primary transition-theme"
                >
                  {page.title}
                </Link>
              ))}
            </div>
          )}
          <p className="text-theme-secondary">
            © {new Date().getFullYear()} Tous droits réservés
          </p>
          <p className="text-sm text-theme-muted mt-2">
            <Link href="/admin" className="hover:text-theme-primary transition-theme">
              Administration
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
