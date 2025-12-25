'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, FileText, Home, Settings, BarChart3, Palette, FileStack } from 'lucide-react'
import { signOut } from 'next-auth/react'

const navigation = [
  { name: 'Tableau de bord', href: '/admin', icon: Home },
  { name: 'Articles', href: '/admin/articles', icon: FileText },
  { name: 'Pages', href: '/admin/pages', icon: FileStack },
  { name: 'Contenu des pages', href: '/admin/page-content', icon: Settings },
  { name: 'Design System', href: '/admin/design-system', icon: Palette },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white font-bold text-xl">
                Portfolio Admin
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      } px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
