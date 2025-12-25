'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, Type, X } from 'lucide-react'
import { GOOGLE_FONTS, GoogleFont, getFontFamily, searchFonts, getFontsByCategory } from '@/app/lib/googleFonts'
import { loadGoogleFont, extractFontName } from '@/app/lib/fontLoader'

interface FontPickerProps {
  label: string
  value: string
  onChange: (fontName: string, fontFamily: string) => void
  description?: string
  recommendedCategory?: GoogleFont['category']
}

export function FontPicker({ label, value, onChange, description, recommendedCategory }: FontPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<GoogleFont['category'] | 'all'>('all')

  // Extraire le nom de la police depuis la valeur CSS
  const currentFontName = useMemo(() => {
    return extractFontName(value)
  }, [value])

  // Filtrer les polices
  const filteredFonts = useMemo(() => {
    let fonts = GOOGLE_FONTS

    // Filtrer par catégorie
    if (selectedCategory !== 'all') {
      fonts = getFontsByCategory(selectedCategory)
    }

    // Filtrer par recherche
    if (searchQuery) {
      fonts = searchFonts(searchQuery)
      if (selectedCategory !== 'all') {
        fonts = fonts.filter(f => f.category === selectedCategory)
      }
    }

    return fonts.slice(0, 50) // Limiter à 50 pour les performances
  }, [searchQuery, selectedCategory])

  // Charger la police courante au démarrage
  useEffect(() => {
    if (currentFontName) {
      loadGoogleFont(currentFontName, ['400', '600'], 'picker')
    }
  }, [currentFontName])

  // Précharger les polices populaires
  useEffect(() => {
    if (isOpen) {
      const popularFonts = GOOGLE_FONTS.slice(0, 20)
      popularFonts.forEach(font => loadGoogleFont(font.name, ['400', '600'], 'picker'))
    }
  }, [isOpen])

  const handleSelectFont = (font: GoogleFont) => {
    loadGoogleFont(font.name, ['400', '600'], 'picker')
    const fontFamily = getFontFamily(font.name, font.category)
    onChange(font.name, fontFamily)
    setIsOpen(false)
    setSearchQuery('')
  }

  const categories: { value: GoogleFont['category'] | 'all', label: string }[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'sans-serif', label: 'Sans-serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'monospace', label: 'Monospace' },
    { value: 'display', label: 'Display' },
    { value: 'handwriting', label: 'Handwriting' }
  ]

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {/* Bouton de sélection */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-indigo-500 transition-colors text-left flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <Type className="w-5 h-5 text-gray-400 group-hover:text-indigo-600" />
          <div>
            <div 
              className="font-medium text-gray-900"
              style={{ fontFamily: value }}
            >
              {currentFontName}
            </div>
            <div className="text-xs text-gray-500">{value}</div>
          </div>
        </div>
        <div className="text-sm text-indigo-600 font-medium">Changer</div>
      </button>

      {/* Modal de sélection */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[80vh] flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Choisir une police
                  </h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une police..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    autoFocus
                  />
                </div>

                {/* Filtres par catégorie */}
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat.value
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {recommendedCategory && selectedCategory === 'all' && (
                  <p className="text-xs text-indigo-600 mt-2">
                    💡 Recommandé : {categories.find(c => c.value === recommendedCategory)?.label}
                  </p>
                )}
              </div>

              {/* Liste des polices */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-2">
                  {filteredFonts.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">
                      Aucune police trouvée
                    </div>
                  ) : (
                    filteredFonts.map((font) => {
                      const isSelected = font.name === currentFontName
                      const fontFamily = getFontFamily(font.name, font.category)

                      return (
                        <button
                          key={font.name}
                          onClick={() => handleSelectFont(font)}
                          onMouseEnter={() => loadGoogleFont(font.name, ['400', '600'], 'picker')}
                          className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:border-indigo-500 hover:shadow-md ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50'
                              : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">
                              {font.name}
                            </span>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                              {font.category}
                            </span>
                          </div>
                          <div 
                            className="text-2xl text-gray-800"
                            style={{ fontFamily }}
                          >
                            The quick brown fox jumps over the lazy dog
                          </div>
                          <div 
                            className="text-sm text-gray-600 mt-1"
                            style={{ fontFamily }}
                          >
                            1234567890 !@#$%^&*()
                          </div>
                        </button>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50 text-center text-xs text-gray-500">
                {filteredFonts.length} police{filteredFonts.length > 1 ? 's' : ''} disponible{filteredFonts.length > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
