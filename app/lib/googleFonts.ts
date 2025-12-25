// Liste des Google Fonts les plus populaires avec catégories

export interface GoogleFont {
  name: string
  category: 'sans-serif' | 'serif' | 'monospace' | 'display' | 'handwriting'
  variants: string[]
  popularity: number // 1-100
}

export const GOOGLE_FONTS: GoogleFont[] = [
  // Sans-Serif (Modern, Clean)
  { name: 'Inter', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], popularity: 100 },
  { name: 'Roboto', category: 'sans-serif', variants: ['300', '400', '500', '700'], popularity: 99 },
  { name: 'Open Sans', category: 'sans-serif', variants: ['300', '400', '600', '700'], popularity: 98 },
  { name: 'Montserrat', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], popularity: 97 },
  { name: 'Poppins', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], popularity: 96 },
  { name: 'Lato', category: 'sans-serif', variants: ['300', '400', '700'], popularity: 95 },
  { name: 'Nunito', category: 'sans-serif', variants: ['300', '400', '600', '700'], popularity: 94 },
  { name: 'Raleway', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], popularity: 93 },
  { name: 'Manrope', category: 'sans-serif', variants: ['400', '500', '600', '700'], popularity: 92 },
  { name: 'Work Sans', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], popularity: 91 },
  { name: 'Source Sans 3', category: 'sans-serif', variants: ['300', '400', '600', '700'], popularity: 90 },
  { name: 'Rubik', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], popularity: 89 },
  { name: 'Quicksand', category: 'sans-serif', variants: ['400', '500', '600', '700'], popularity: 88 },
  { name: 'Outfit', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], popularity: 87 },
  { name: 'DM Sans', category: 'sans-serif', variants: ['400', '500', '700'], popularity: 86 },
  { name: 'Barlow', category: 'sans-serif', variants: ['300', '400', '500', '600', '700'], popularity: 85 },
  { name: 'Archivo', category: 'sans-serif', variants: ['400', '500', '600', '700'], popularity: 84 },
  { name: 'Karla', category: 'sans-serif', variants: ['400', '500', '600', '700'], popularity: 83 },
  { name: 'Josefin Sans', category: 'sans-serif', variants: ['300', '400', '600', '700'], popularity: 82 },

  // Serif (Classic, Elegant)
  { name: 'Playfair Display', category: 'serif', variants: ['400', '500', '600', '700'], popularity: 95 },
  { name: 'Merriweather', category: 'serif', variants: ['300', '400', '700'], popularity: 94 },
  { name: 'Lora', category: 'serif', variants: ['400', '500', '600', '700'], popularity: 93 },
  { name: 'Crimson Text', category: 'serif', variants: ['400', '600', '700'], popularity: 92 },
  { name: 'EB Garamond', category: 'serif', variants: ['400', '500', '600', '700'], popularity: 91 },
  { name: 'Libre Baskerville', category: 'serif', variants: ['400', '700'], popularity: 90 },
  { name: 'Cormorant Garamond', category: 'serif', variants: ['300', '400', '500', '600', '700'], popularity: 89 },
  { name: 'Noto Serif', category: 'serif', variants: ['400', '700'], popularity: 88 },
  { name: 'PT Serif', category: 'serif', variants: ['400', '700'], popularity: 87 },
  { name: 'Bitter', category: 'serif', variants: ['400', '500', '600', '700'], popularity: 86 },
  { name: 'Spectral', category: 'serif', variants: ['300', '400', '600', '700'], popularity: 85 },
  { name: 'Cardo', category: 'serif', variants: ['400', '700'], popularity: 84 },

  // Monospace (Code, Technical)
  { name: 'Fira Code', category: 'monospace', variants: ['300', '400', '500', '600', '700'], popularity: 98 },
  { name: 'JetBrains Mono', category: 'monospace', variants: ['400', '500', '600', '700'], popularity: 97 },
  { name: 'Source Code Pro', category: 'monospace', variants: ['400', '500', '600', '700'], popularity: 96 },
  { name: 'Roboto Mono', category: 'monospace', variants: ['400', '500', '700'], popularity: 95 },
  { name: 'Space Mono', category: 'monospace', variants: ['400', '700'], popularity: 94 },
  { name: 'IBM Plex Mono', category: 'monospace', variants: ['400', '500', '600', '700'], popularity: 93 },
  { name: 'Inconsolata', category: 'monospace', variants: ['400', '700'], popularity: 92 },
  { name: 'Courier Prime', category: 'monospace', variants: ['400', '700'], popularity: 91 },
  { name: 'Overpass Mono', category: 'monospace', variants: ['400', '600', '700'], popularity: 90 },

  // Display (Creative, Headers)
  { name: 'Bebas Neue', category: 'display', variants: ['400'], popularity: 96 },
  { name: 'Righteous', category: 'display', variants: ['400'], popularity: 95 },
  { name: 'Oswald', category: 'display', variants: ['300', '400', '500', '600', '700'], popularity: 94 },
  { name: 'Anton', category: 'display', variants: ['400'], popularity: 93 },
  { name: 'Fjalla One', category: 'display', variants: ['400'], popularity: 92 },
  { name: 'Secular One', category: 'display', variants: ['400'], popularity: 91 },
  { name: 'Alfa Slab One', category: 'display', variants: ['400'], popularity: 90 },
  { name: 'Titan One', category: 'display', variants: ['400'], popularity: 88 },
  { name: 'Archivo Black', category: 'display', variants: ['400'], popularity: 87 },
  { name: 'Lobster', category: 'display', variants: ['400'], popularity: 86 },

  // Handwriting (Casual, Personal)
  { name: 'Caveat', category: 'handwriting', variants: ['400', '500', '600', '700'], popularity: 94 },
  { name: 'Dancing Script', category: 'handwriting', variants: ['400', '500', '600', '700'], popularity: 93 },
  { name: 'Pacifico', category: 'handwriting', variants: ['400'], popularity: 92 },
  { name: 'Satisfy', category: 'handwriting', variants: ['400'], popularity: 91 },
  { name: 'Shadows Into Light', category: 'handwriting', variants: ['400'], popularity: 90 },
]

export const DEFAULT_FONTS: Record<string, string> = {
  'sans-serif': 'Inter',
  'serif': 'Playfair Display',
  'monospace': 'Fira Code',
  'display': 'Bebas Neue',
  'handwriting': 'Caveat'
}

// Générer l'URL Google Fonts pour charger une police
export function getGoogleFontUrl(fontName: string, weights: string[] = ['400', '500', '600', '700']): string {
  const formattedName = fontName.replace(/ /g, '+')
  const weightString = weights.join(',')
  return `https://fonts.googleapis.com/css2?family=${formattedName}:wght@${weightString}&display=swap`
}

// Générer le CSS @import pour une police
export function getGoogleFontImport(fontName: string, weights: string[] = ['400', '500', '600', '700']): string {
  return `@import url('${getGoogleFontUrl(fontName, weights)}');`
}

// Obtenir la propriété CSS font-family
export function getFontFamily(fontName: string, category: string): string {
  return `'${fontName}', ${category}`
}

// Chercher une police par nom
export function findFont(name: string): GoogleFont | undefined {
  return GOOGLE_FONTS.find(font => font.name.toLowerCase() === name.toLowerCase())
}

// Filtrer par catégorie
export function getFontsByCategory(category: GoogleFont['category']): GoogleFont[] {
  return GOOGLE_FONTS.filter(font => font.category === category)
}

// Rechercher des polices
export function searchFonts(query: string): GoogleFont[] {
  const lowerQuery = query.toLowerCase()
  return GOOGLE_FONTS.filter(font => 
    font.name.toLowerCase().includes(lowerQuery)
  ).sort((a, b) => b.popularity - a.popularity)
}
