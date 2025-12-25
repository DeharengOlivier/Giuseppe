'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Briefcase, FileText, Calendar, Star, Users, Info, Menu, X } from 'lucide-react'
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
  const [pastHero, setPastHero] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { navPages, loading, siteContent } = usePages()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 20)
      // On considère qu'on a passé le hero après environ 80% de la hauteur de l'écran ou 500px
      // C'est un point de bascule arbitraire mais efficace pour l'UX
      const heroThreshold = window.innerHeight * 0.8
      setPastHero(scrollY > heroThreshold)
    }

    // Check initial logic
    handleScroll()

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/articles', label: 'Articles', icon: FileText },
    ...navPages.map(page => ({
      href: `/${page.slug}`,
      label: page.title,
      icon: page.icon ? iconMap[page.icon] : null,
    })),
  ]

  const siteName = siteContent?.home_hero_name || 'Giuseppe Rossi'
  const isHomePage = pathname === '/'
  const showHeroStyle = isHomePage && !pastHero

  if (loading) return null

  // Styles dynamiques selon la position
  // Si sur Hero (Home non scrollée) : Position absolue en haut à droite, pillule minimale
  // Sinon : Position fixe centrée, pillule complète
  const containerClasses = showHeroStyle && !mobileMenuOpen
    ? "absolute top-4 right-4 z-50 flex justify-end px-4" // Hero style (Top Right)
    : "fixed top-4 left-0 right-0 z-50 flex justify-center pt-0 px-4" // Standard style (Centered)

  return (
    <>
      <div className={containerClasses}>
        <nav
          className={`
            bg-theme-alt border border-theme-main rounded-2xl md:rounded-full
            transition-all duration-300 ease-out
            ${scrolled || mobileMenuOpen || !showHeroStyle
              ? 'shadow-theme-lg backdrop-blur-md'
              : 'shadow-theme-md backdrop-blur-sm'
            }
            ${mobileMenuOpen ? 'w-full max-w-sm rounded-[2rem]' : 'w-auto'}
          `}
        >
          <div className="px-4 py-2">
            {/* Desktop & Collapsed Mobile View */}
            <div className="flex items-center justify-between">

              {/* DESKTOP: Always show full list */}
              <div className="hidden md:flex items-center gap-1">
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
                        ${isActive
                          ? 'text-theme-primary bg-theme-main/50'
                          : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-main/30'
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

              {/* MOBILE Header */}
              <div className="flex md:hidden items-center gap-4">
                {/* 
                   Name Display Logic on Mobile:
                   - Hidden if we are on the Hero section (unless menu is open)
                   - Visible if we scrolled past hero OR if we are on another page
                */}
                {(!showHeroStyle || mobileMenuOpen) && (
                  <Link href="/" className="flex items-center gap-2 px-2 py-1.5 font-bold text-theme-primary animate-in fade-in slide-in-from-left-4 duration-300">
                    <span>{siteName}</span>
                  </Link>
                )}

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-theme-primary hover:bg-theme-main/50 rounded-full transition-colors"
                  aria-label="Menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Dropdown */}
            {mobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-theme-main/20 pt-4 animate-in slide-in-from-top-2 fade-in duration-200">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  const Icon = item.icon

                  return (
                    <Link
                      key={item.href}
                      href={item.href} // Will trigger useEffect to close menu
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl font-medium
                        transition-theme
                        ${isActive
                          ? 'text-theme-primary bg-theme-main/50'
                          : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-main/30'
                        }
                      `}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Overlay backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
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
