'use client'

import { useState, useEffect } from 'react'
import { X, Save, Sparkles } from 'lucide-react'
import { ColorPicker, ColorPalette, generateColorPalettes } from './ColorPicker'
import { ThemePreview } from './ThemePreview'
import { FontPicker } from './FontPicker'

interface ThemeFormData {
  displayName: string
  colors: {
    primary: { main: string; hover: string; light: string }
    secondary: { main: string; hover: string }
    background: { main: string; alt: string }
    text: { primary: string; secondary: string; muted: string }
    border: { main: string; light: string }
  }
  typography: {
    fontFamily: {
      heading: string
      body: string
      mono: string
    }
  }
}

interface ThemeEditorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (theme: ThemeFormData) => Promise<void>
  initialData?: ThemeFormData
  mode: 'create' | 'edit'
}

const defaultTheme: ThemeFormData = {
  displayName: '',
  colors: {
    primary: { main: '#6b7280', hover: '#4b5563', light: '#9ca3af' },
    secondary: { main: '#d1d5db', hover: '#9ca3af' },
    background: { main: '#fafafa', alt: '#ffffff' },
    text: { primary: '#111827', secondary: '#4b5563', muted: '#6b7280' },
    border: { main: '#e5e7eb', light: '#f3f4f6' }
  },
  typography: {
    fontFamily: {
      heading: "'Inter', -apple-system, sans-serif",
      body: "'Inter', -apple-system, sans-serif",
      mono: "'Fira Code', monospace"
    }
  }
}

export function ThemeEditor({ isOpen, onClose, onSave, initialData, mode }: ThemeEditorProps) {
  const [formData, setFormData] = useState<ThemeFormData>(initialData || defaultTheme)
  const [saving, setSaving] = useState(false)
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null)
  const [palettes, setPalettes] = useState(generateColorPalettes(formData.colors.primary.main))

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  useEffect(() => {
    // Régénérer les palettes quand la couleur primaire change
    setPalettes(generateColorPalettes(formData.colors.primary.main))
  }, [formData.colors.primary.main])

  const updateColor = (path: string[], value: string) => {
    setFormData(prev => {
      const newData = { ...prev }
      let current: any = newData
      
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] }
        current = current[path[i]]
      }
      
      current[path[path.length - 1]] = value
      return newData
    })
  }

  const applyPalette = (paletteType: 'monochrome' | 'analogous' | 'complementary' | 'triadic') => {
    const palette = palettes[paletteType]
    
    if (paletteType === 'monochrome') {
      // Appliquer la palette monochrome sur primary
      setFormData(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          primary: {
            main: palette[2],
            hover: palette[3],
            light: palette[1]
          }
        }
      }))
    } else if (paletteType === 'complementary') {
      // Utiliser la couleur complémentaire pour secondary
      setFormData(prev => ({
        ...prev,
        colors: {
          ...prev.colors,
          secondary: {
            main: palette[1],
            hover: palette[3]
          }
        }
      }))
    }
    
    setSelectedPalette(paletteType)
    setTimeout(() => setSelectedPalette(null), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde du thème')
    } finally {
      setSaving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex">
          {/* Formulaire à gauche */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === 'create' ? 'Créer un thème personnalisé' : 'Modifier le thème'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-8">
              {/* Nom du thème */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du thème
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Mon thème personnalisé"
                  required
                />
              </div>

              {/* Palettes suggérées */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-indigo-900">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="font-semibold">Palettes suggérées</h3>
                </div>
                <p className="text-sm text-indigo-700">
                  Basées sur votre couleur primaire. Cliquez sur une palette pour l'appliquer.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    onClick={() => applyPalette('monochrome')}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedPalette === 'monochrome' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    <ColorPalette 
                      colors={palettes.monochrome} 
                      onSelect={(color) => updateColor(['colors', 'primary', 'main'], color)}
                      label="Monochrome"
                    />
                  </div>
                  
                  <div
                    onClick={() => applyPalette('analogous')}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedPalette === 'analogous' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    <ColorPalette 
                      colors={palettes.analogous} 
                      onSelect={(color) => updateColor(['colors', 'primary', 'main'], color)}
                      label="Analogues"
                    />
                  </div>
                  
                  <div
                    onClick={() => applyPalette('complementary')}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedPalette === 'complementary' 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:border-indigo-300 bg-white'
                      }`}
                    >
                      <ColorPalette 
                        colors={palettes.complementary} 
                        onSelect={(color) => updateColor(['colors', 'secondary', 'main'], color)}
                        label="Complémentaires"
                      />
                  </div>
                  
                  <div
                    onClick={() => applyPalette('triadic')}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedPalette === 'triadic' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-indigo-300 bg-white'
                    }`}
                  >
                    <ColorPalette 
                      colors={palettes.triadic} 
                      onSelect={(color) => updateColor(['colors', 'primary', 'main'], color)}
                      label="Triadiques"
                    />
                  </div>
                </div>
              </div>

              {/* Couleurs primaires */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Couleurs primaires</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ColorPicker
                    label="Principal"
                    value={formData.colors.primary.main}
                    onChange={(color) => updateColor(['colors', 'primary', 'main'], color)}
                    description="Couleur principale (boutons, liens)"
                  />
                  <ColorPicker
                    label="Survol"
                    value={formData.colors.primary.hover}
                    onChange={(color) => updateColor(['colors', 'primary', 'hover'], color)}
                    description="Au survol des éléments"
                  />
                  <ColorPicker
                    label="Clair"
                    value={formData.colors.primary.light}
                    onChange={(color) => updateColor(['colors', 'primary', 'light'], color)}
                    description="Version atténuée"
                  />
                </div>
              </div>

              {/* Couleurs secondaires */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Couleurs secondaires</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorPicker
                    label="Principal"
                    value={formData.colors.secondary.main}
                    onChange={(color) => updateColor(['colors', 'secondary', 'main'], color)}
                    description="Accents secondaires"
                  />
                  <ColorPicker
                    label="Survol"
                    value={formData.colors.secondary.hover}
                    onChange={(color) => updateColor(['colors', 'secondary', 'hover'], color)}
                    description="Au survol"
                  />
                </div>
              </div>

              {/* Couleurs d'arrière-plan */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Arrière-plans</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorPicker
                    label="Principal"
                    value={formData.colors.background.main}
                    onChange={(color) => updateColor(['colors', 'background', 'main'], color)}
                    description="Fond de page"
                  />
                  <ColorPicker
                    label="Alternatif"
                    value={formData.colors.background.alt}
                    onChange={(color) => updateColor(['colors', 'background', 'alt'], color)}
                    description="Cartes, sections"
                  />
                </div>
              </div>

              {/* Couleurs de texte */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Textes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ColorPicker
                    label="Principal"
                    value={formData.colors.text.primary}
                    onChange={(color) => updateColor(['colors', 'text', 'primary'], color)}
                    description="Titres, texte principal"
                  />
                  <ColorPicker
                    label="Secondaire"
                    value={formData.colors.text.secondary}
                    onChange={(color) => updateColor(['colors', 'text', 'secondary'], color)}
                    description="Descriptions"
                  />
                  <ColorPicker
                    label="Atténué"
                    value={formData.colors.text.muted}
                    onChange={(color) => updateColor(['colors', 'text', 'muted'], color)}
                    description="Dates, métadonnées"
                  />
                </div>
              </div>

              {/* Couleurs de bordure */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Bordures</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorPicker
                    label="Principal"
                    value={formData.colors.border.main}
                    onChange={(color) => updateColor(['colors', 'border', 'main'], color)}
                    description="Bordures standard"
                  />
                  <ColorPicker
                    label="Clair"
                    value={formData.colors.border.light}
                    onChange={(color) => updateColor(['colors', 'border', 'light'], color)}
                    description="Séparateurs subtils"
                  />
                </div>
              </div>

              {/* Typographie */}
              <div className="space-y-4 pt-8 border-t-2 border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Typographie</h3>
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                    Google Fonts
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-6">
                  Choisissez parmi plus de 60 polices Google Fonts populaires
                </p>
                
                <div className="space-y-6">
                  <FontPicker
                    label="Police des titres"
                    value={formData.typography.fontFamily.heading}
                    onChange={(fontName, fontFamily) => {
                      setFormData(prev => ({
                        ...prev,
                        typography: {
                          ...prev.typography,
                          fontFamily: {
                            ...prev.typography.fontFamily,
                            heading: fontFamily
                          }
                        }
                      }))
                    }}
                    description="Utilisée pour les titres (h1, h2, h3...)"
                    recommendedCategory="sans-serif"
                  />

                  <FontPicker
                    label="Police du corps"
                    value={formData.typography.fontFamily.body}
                    onChange={(fontName, fontFamily) => {
                      setFormData(prev => ({
                        ...prev,
                        typography: {
                          ...prev.typography,
                          fontFamily: {
                            ...prev.typography.fontFamily,
                            body: fontFamily
                          }
                        }
                      }))
                    }}
                    description="Utilisée pour le texte principal"
                    recommendedCategory="sans-serif"
                  />

                  <FontPicker
                    label="Police monospace"
                    value={formData.typography.fontFamily.mono}
                    onChange={(fontName, fontFamily) => {
                      setFormData(prev => ({
                        ...prev,
                        typography: {
                          ...prev.typography,
                          fontFamily: {
                            ...prev.typography.fontFamily,
                            mono: fontFamily
                          }
                        }
                      }))
                    }}
                    description="Utilisée pour le code et les éléments techniques"
                    recommendedCategory="monospace"
                  />
                </div>
              </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.displayName}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Enregistrement...' : mode === 'create' ? 'Créer le thème' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>

          {/* Prévisualisation à droite */}
          <div className="w-96 bg-gray-50 border-l border-gray-200 overflow-y-auto p-6">
            <ThemePreview colors={formData.colors} typography={formData.typography} />
          </div>
        </div>
      </div>
    </div>
  )
}