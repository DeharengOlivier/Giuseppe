'use client'

import { useEffect } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { loadFromFontFamily } from '@/app/lib/fontLoader'

interface ThemePreviewProps {
  colors: {
    primary: { main: string; hover: string; light: string }
    secondary: { main: string; hover: string }
    background: { main: string; alt: string }
    text: { primary: string; secondary: string; muted: string }
    border: { main: string; light: string }
  }
  typography?: {
    fontFamily: {
      heading: string
      body: string
      mono: string
    }
  }
}

export function ThemePreview({ colors, typography }: ThemePreviewProps) {
  const headingFont = typography?.fontFamily.heading || 'inherit'
  const bodyFont = typography?.fontFamily.body || 'inherit'

  // Charger les polices dès que le composant est monté
  useEffect(() => {
    if (typography) {
      loadFromFontFamily(typography.fontFamily.heading)
      loadFromFontFamily(typography.fontFamily.body)
      loadFromFontFamily(typography.fontFamily.mono)
    }
  }, [typography?.fontFamily.heading, typography?.fontFamily.body, typography?.fontFamily.mono])

  return (
    <div className="space-y-6" style={{ fontFamily: bodyFont }}>
      <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: headingFont }}>
        Prévisualisation
      </h3>
      
      <div 
        className="rounded-2xl shadow-xl overflow-hidden border-2"
        style={{ 
          backgroundColor: colors.background.main,
          borderColor: colors.border.main
        }}
      >
        {/* Hero miniature */}
        <div 
          className="p-8 text-center"
          style={{ backgroundColor: colors.background.main }}
        >
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: colors.text.primary, fontFamily: headingFont }}
          >
            Votre Portfolio
          </h1>
          <p 
            className="text-lg mb-4"
            style={{ color: colors.text.secondary, fontFamily: bodyFont }}
          >
            Développeur Web Full Stack
          </p>
          <button
            className="inline-flex items-center px-6 py-3 rounded-full font-medium transition-all"
            style={{
              backgroundColor: colors.primary.main,
              color: colors.background.alt
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary.hover
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = colors.primary.main
            }}
          >
            Me contacter
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>

        {/* Carte article */}
        <div 
          className="p-6 m-4 rounded-xl border"
          style={{ 
            backgroundColor: colors.background.alt,
            borderColor: colors.border.main,
            fontFamily: bodyFont
          }}
        >
          <div 
            className="text-sm mb-2"
            style={{ color: colors.text.muted }}
          >
            15 novembre 2025
          </div>
          <h3 
            className="text-xl font-semibold mb-2"
            style={{ color: colors.text.primary, fontFamily: headingFont }}
          >
            Titre de l'article
          </h3>
          <p 
            className="mb-4"
            style={{ color: colors.text.secondary, fontFamily: bodyFont }}
          >
            Un extrait de l'article qui donne un aperçu du contenu...
          </p>
          <a
            href="#"
            className="inline-flex items-center font-medium"
            style={{ color: colors.primary.main }}
            onClick={(e) => e.preventDefault()}
          >
            Lire la suite
            <ArrowRight className="ml-1 w-4 h-4" />
          </a>
        </div>

        {/* Badges */}
        <div className="p-6 flex flex-wrap gap-3">
          <span
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundColor: colors.primary.light,
              color: colors.text.primary
            }}
          >
            <Check className="inline w-4 h-4 mr-1" />
            Primaire
          </span>
          <span
            className="px-4 py-2 rounded-full text-sm font-medium"
            style={{
              backgroundColor: colors.secondary.main,
              color: colors.text.primary
            }}
          >
            Secondaire
          </span>
          <span
            className="px-4 py-2 rounded-full text-sm font-medium border"
            style={{
              borderColor: colors.border.main,
              color: colors.text.secondary
            }}
          >
            Outline
          </span>
        </div>

        {/* Footer miniature */}
        <div 
          className="p-4 text-center border-t"
          style={{ 
            backgroundColor: colors.background.alt,
            borderColor: colors.border.light
          }}
        >
          <p 
            className="text-sm"
            style={{ color: colors.text.muted }}
          >
            © 2025 - Tous droits réservés
          </p>
        </div>
      </div>

      {/* Palette de couleurs */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Palette complète</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <div 
              className="h-12 rounded-lg border"
              style={{ backgroundColor: colors.primary.main, borderColor: colors.border.main }}
              title={colors.primary.main}
            />
            <p className="text-xs text-gray-600 text-center">Primary</p>
          </div>
          <div className="space-y-1">
            <div 
              className="h-12 rounded-lg border"
              style={{ backgroundColor: colors.secondary.main, borderColor: colors.border.main }}
              title={colors.secondary.main}
            />
            <p className="text-xs text-gray-600 text-center">Secondary</p>
          </div>
          <div className="space-y-1">
            <div 
              className="h-12 rounded-lg border"
              style={{ backgroundColor: colors.background.main, borderColor: colors.border.main }}
              title={colors.background.main}
            />
            <p className="text-xs text-gray-600 text-center">Background</p>
          </div>
          <div className="space-y-1">
            <div 
              className="h-12 rounded-lg border"
              style={{ backgroundColor: colors.background.alt, borderColor: colors.border.main }}
              title={colors.background.alt}
            />
            <p className="text-xs text-gray-600 text-center">Alt BG</p>
          </div>
          <div className="space-y-1">
            <div 
              className="h-12 rounded-lg border flex items-center justify-center"
              style={{ backgroundColor: 'white', borderColor: colors.border.main }}
            >
              <span style={{ color: colors.text.primary }}>Aa</span>
            </div>
            <p className="text-xs text-gray-600 text-center">Text</p>
          </div>
          <div className="space-y-1">
            <div 
              className="h-12 rounded-lg"
              style={{ backgroundColor: colors.border.main }}
              title={colors.border.main}
            />
            <p className="text-xs text-gray-600 text-center">Border</p>
          </div>
        </div>
      </div>
    </div>
  )
}
