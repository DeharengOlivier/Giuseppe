'use client'

import { useEffect, useState } from 'react'
import { GoogleFontsLoader } from './GoogleFontsLoader'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [fonts, setFonts] = useState<{heading: string, body: string, mono: string} | null>(null)

  useEffect(() => {
    // Charger et appliquer le thème actif
    const loadTheme = async () => {
      try {
        const res = await fetch('/api/themes/active')
        if (!res.ok) return
        
        const theme = await res.json()
        const config = JSON.parse(theme.config)
        
        // Appliquer les CSS variables
        const root = document.documentElement
        
        // Couleurs
        root.style.setProperty('--color-primary', config.colors.primary.main)
        root.style.setProperty('--color-primary-hover', config.colors.primary.hover)
        root.style.setProperty('--color-primary-light', config.colors.primary.light)
        root.style.setProperty('--color-secondary', config.colors.secondary.main)
        root.style.setProperty('--color-secondary-hover', config.colors.secondary.hover)
        root.style.setProperty('--color-bg-main', config.colors.background.main)
        root.style.setProperty('--color-bg-alt', config.colors.background.alt)
        root.style.setProperty('--color-text-primary', config.colors.text.primary)
        root.style.setProperty('--color-text-secondary', config.colors.text.secondary)
        root.style.setProperty('--color-text-muted', config.colors.text.muted)
        root.style.setProperty('--color-border-main', config.colors.border.main)
        root.style.setProperty('--color-border-light', config.colors.border.light)
        
        // Typographie
        root.style.setProperty('--font-heading', config.typography.fontFamily.heading)
        root.style.setProperty('--font-body', config.typography.fontFamily.body)
        root.style.setProperty('--font-mono', config.typography.fontFamily.mono)
        root.style.setProperty('--text-h1', config.typography.fontSize.h1)
        root.style.setProperty('--text-h2', config.typography.fontSize.h2)
        root.style.setProperty('--text-h3', config.typography.fontSize.h3)
        root.style.setProperty('--text-h4', config.typography.fontSize.h4)
        root.style.setProperty('--text-body', config.typography.fontSize.body)
        root.style.setProperty('--text-small', config.typography.fontSize.small)
        
        // Espacements
        root.style.setProperty('--spacing-section-y', config.spacing.section.y)
        root.style.setProperty('--spacing-section-x', config.spacing.section.x)
        root.style.setProperty('--spacing-card-padding', config.spacing.card.padding)
        root.style.setProperty('--spacing-card-gap', config.spacing.card.gap)
        
        // Border radius
        root.style.setProperty('--radius-button', config.borderRadius.button)
        root.style.setProperty('--radius-card', config.borderRadius.card)
        root.style.setProperty('--radius-input', config.borderRadius.input)
        root.style.setProperty('--radius-image', config.borderRadius.image)
        
        // Shadows
        root.style.setProperty('--shadow-sm', config.shadows.sm)
        root.style.setProperty('--shadow-md', config.shadows.md)
        root.style.setProperty('--shadow-lg', config.shadows.lg)
        root.style.setProperty('--shadow-xl', config.shadows.xl)
        
        // Animations
        root.style.setProperty('--duration-fast', config.animation.duration.fast)
        root.style.setProperty('--duration-normal', config.animation.duration.normal)
        root.style.setProperty('--duration-slow', config.animation.duration.slow)
        root.style.setProperty('--easing', config.animation.easing)
        root.style.setProperty('--hover-scale', config.animation.hover.scale)
        root.style.setProperty('--hover-translate-y', config.animation.hover.translateY)
        
        // Charger les Google Fonts
        setFonts({
          heading: config.typography.fontFamily.heading,
          body: config.typography.fontFamily.body,
          mono: config.typography.fontFamily.mono
        })
        
        console.log('✅ Thème appliqué:', theme.displayName)
      } catch (error) {
        console.error('❌ Erreur lors du chargement du thème:', error)
      }
    }
    
    loadTheme()
  }, [])
  
  return (
    <>
      {fonts && <GoogleFontsLoader fonts={fonts} />}
      {children}
    </>
  )
}
