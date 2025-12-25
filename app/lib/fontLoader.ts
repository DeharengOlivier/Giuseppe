// Utilitaire centralisé pour charger les polices Google Fonts
// Évite les duplications et améliore les performances

const loadedFonts = new Set<string>()
let preconnectAdded = false

/**
 * Extraire le nom d'une police depuis une chaîne font-family CSS
 */
export function extractFontName(fontFamily: string): string {
  // Ignorer les variables CSS
  if (fontFamily.includes('var(')) {
    return ''
  }
  
  const match = fontFamily.match(/^'([^']+)'/)
  return match ? match[1] : fontFamily.split(',')[0].trim().replace(/'/g, '')
}

/**
 * Vérifier si une police est une police système
 */
export function isSystemFont(fontName: string): boolean {
  // Vide = police système ou invalide
  if (!fontName) return true
  
  const systemFonts = [
    'system-ui', 
    'arial', 
    'helvetica', 
    'sans-serif', 
    'serif', 
    'monospace', 
    'apple',
    'inherit',
    'initial',
    'unset',
    'var(' // Variables CSS
  ]
  const lowerFontName = fontName.toLowerCase()
  return systemFonts.some(sys => lowerFontName.includes(sys))
}

/**
 * Ajouter les liens de préconnexion pour Google Fonts (à faire une seule fois)
 */
function addPreconnect(): void {
  if (preconnectAdded || typeof window === 'undefined') return

  const preconnect = document.createElement('link')
  preconnect.href = 'https://fonts.googleapis.com'
  preconnect.rel = 'preconnect'
  preconnect.crossOrigin = 'anonymous'

  const preconnectGstatic = document.createElement('link')
  preconnectGstatic.href = 'https://fonts.gstatic.com'
  preconnectGstatic.rel = 'preconnect'
  preconnectGstatic.crossOrigin = 'anonymous'

  if (!document.querySelector('link[href="https://fonts.googleapis.com"]')) {
    document.head.appendChild(preconnect)
  }
  if (!document.querySelector('link[href="https://fonts.gstatic.com"]')) {
    document.head.appendChild(preconnectGstatic)
  }

  preconnectAdded = true
}

/**
 * Charger une police Google Fonts
 * @param fontName - Le nom de la police (ex: "Inter", "Playfair Display")
 * @param weights - Les poids à charger (par défaut: ['300', '400', '500', '600', '700'])
 * @param prefix - Un préfixe pour l'ID du link (évite les conflits)
 * @returns true si la police a été chargée, false si elle était déjà chargée ou si c'est une police système
 */
export function loadGoogleFont(
  fontName: string, 
  weights: string[] = ['300', '400', '500', '600', '700'],
  prefix: string = 'google-font'
): boolean {
  if (typeof window === 'undefined') return false

  // Vérifier si c'est une police système
  if (isSystemFont(fontName)) {
    return false
  }

  // Vérifier si la police est déjà chargée
  if (loadedFonts.has(fontName)) {
    return false
  }

  // Ajouter les préconnexions si ce n'est pas déjà fait
  addPreconnect()

  const linkId = `${prefix}-${fontName.replace(/\s+/g, '-').toLowerCase()}`

  // Vérifier si le link existe déjà dans le DOM
  if (document.getElementById(linkId)) {
    loadedFonts.add(fontName)
    return false
  }

  const link = document.createElement('link')
  link.id = linkId
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@${weights.join(';')}&display=swap`
  link.rel = 'stylesheet'
  link.crossOrigin = 'anonymous'

  // Gestion du chargement
  link.onload = () => {
    loadedFonts.add(fontName)
    // Dispatch un événement personnalisé pour notifier que la police est chargée
    window.dispatchEvent(new CustomEvent('fontloaded', { detail: { fontName } }))
  }

  link.onerror = () => {
    console.warn(`Failed to load font: ${fontName}`)
  }

  document.head.appendChild(link)

  return true
}

/**
 * Charger plusieurs polices en une fois
 */
export function loadGoogleFonts(
  fontNames: string[],
  weights: string[] = ['300', '400', '500', '600', '700']
): void {
  fontNames.forEach(fontName => {
    loadGoogleFont(fontName, weights)
  })
}

/**
 * Charger une police depuis une chaîne font-family CSS
 */
export function loadFromFontFamily(fontFamily: string): boolean {
  const fontName = extractFontName(fontFamily)
  return loadGoogleFont(fontName)
}

/**
 * Vérifier si une police est déjà chargée
 */
export function isFontLoaded(fontName: string): boolean {
  return loadedFonts.has(fontName)
}

/**
 * Obtenir la liste des polices chargées
 */
export function getLoadedFonts(): string[] {
  return Array.from(loadedFonts)
}
