'use client'

import { useEffect } from 'react'
import { loadFromFontFamily } from '@/app/lib/fontLoader'

interface GoogleFontsLoaderProps {
  fonts: {
    heading: string
    body: string
    mono: string
  }
}

export function GoogleFontsLoader({ fonts }: GoogleFontsLoaderProps) {
  useEffect(() => {
    // Charger les polices en utilisant l'utilitaire centralisé
    loadFromFontFamily(fonts.heading)
    loadFromFontFamily(fonts.body)
    loadFromFontFamily(fonts.mono)
  }, [fonts.heading, fonts.body, fonts.mono])

  return null
}
