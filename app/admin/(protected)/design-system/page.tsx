'use client'

import { useState, useEffect } from 'react'
import { Palette, Check, Sparkles, Download, Upload, Plus, Edit, Trash2, X } from 'lucide-react'
import { ThemeEditor } from '@/app/components/ThemeEditor'
import { ThemePreview } from '@/app/components/ThemePreview'

interface Theme {
  id: string
  name: string
  displayName: string
  isActive: boolean
  isPredefined: boolean
  config: string
}

interface ThemeConfig {
  colors: {
    primary: { main: string; hover: string; light: string }
    secondary: { main: string; hover: string }
    background: { main: string; alt: string }
    text: { primary: string; secondary: string; muted: string }
    border: { main: string; light: string }
  }
  typography: any
  spacing: any
  borderRadius: any
  shadows: any
  animation: any
}

interface ThemeFormData {
  displayName: string
  colors: ThemeConfig['colors']
  typography: {
    fontFamily: {
      heading: string
      body: string
      mono: string
    }
  }
}

export default function DesignSystemPage() {
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [activating, setActivating] = useState<string | null>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingTheme, setEditingTheme] = useState<Theme | null>(null)
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null)

  useEffect(() => {
    loadThemes()
  }, [])

  const loadThemes = async () => {
    try {
      const res = await fetch('/api/themes')
      const data = await res.json()
      setThemes(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const activateTheme = async (themeId: string) => {
    setActivating(themeId)
    try {
      await fetch(`/api/themes/${themeId}/activate`, {
        method: 'POST'
      })
      await loadThemes()
      // Recharger la page pour appliquer le nouveau thème
      window.location.reload()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'activation du thème')
    } finally {
      setActivating(null)
    }
  }

  const deleteTheme = async (themeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce thème ?')) return
    
    try {
      await fetch(`/api/themes`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: themeId })
      })
      await loadThemes()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression du thème')
    }
  }

  const handleSaveTheme = async (formData: ThemeFormData) => {
    const fullConfig: ThemeConfig = {
      colors: formData.colors,
      typography: {
        fontFamily: formData.typography.fontFamily,
        fontSize: {
          h1: '3.75rem',
          h2: '2.25rem',
          h3: '1.875rem',
          h4: '1.5rem',
          body: '1rem',
          small: '0.875rem'
        },
        fontWeight: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        },
        lineHeight: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.75'
        }
      },
      spacing: {
        section: { y: '4rem', x: '1rem' },
        card: { padding: '1.5rem', gap: '1rem' }
      },
      borderRadius: {
        button: '9999px',
        card: '1rem',
        input: '0.5rem',
        image: '0.75rem'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      },
      animation: {
        duration: { fast: '150ms', normal: '300ms', slow: '500ms' },
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        hover: { scale: '1.05', translateY: '-2px' }
      }
    }

    const endpoint = editingTheme ? '/api/themes' : '/api/themes'
    const method = editingTheme ? 'PUT' : 'POST'
    
    const payload = editingTheme
      ? { id: editingTheme.id, displayName: formData.displayName, config: JSON.stringify(fullConfig) }
      : { name: formData.displayName.toLowerCase().replace(/\s+/g, '-'), displayName: formData.displayName, config: JSON.stringify(fullConfig) }

    const res = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!res.ok) throw new Error('Erreur lors de la sauvegarde')
    
    await loadThemes()
    setEditorOpen(false)
    setEditingTheme(null)
  }

  const getThemeColors = (theme: Theme): ThemeConfig['colors'] => {
    const defaultColors = {
      primary: { main: '#111827', hover: '#1f2937', light: '#6b7280' },
      secondary: { main: '#d1d5db', hover: '#9ca3af' },
      background: { main: '#ffffff', alt: '#f9fafb' },
      text: { primary: '#111827', secondary: '#6b7280', muted: '#9ca3af' },
      border: { main: '#e5e7eb', light: '#f3f4f6' }
    }

    try {
      const config = JSON.parse(theme.config) as ThemeConfig
      // Vérifier que colors existe et a les propriétés nécessaires
      if (!config.colors || !config.colors.background) {
        console.warn(`Theme ${theme.name} has invalid colors config, using defaults`)
        return defaultColors
      }
      return config.colors
    } catch (error) {
      console.error(`Failed to parse theme config for ${theme.name}:`, error)
      return defaultColors
    }
  }

  const getThemeTypography = (theme: Theme) => {
    const defaultTypography = {
      heading: "'Inter', -apple-system, sans-serif",
      body: "'Inter', -apple-system, sans-serif",
      mono: "'Fira Code', monospace"
    }

    try {
      const config = JSON.parse(theme.config) as ThemeConfig
      // Vérifier que typography et fontFamily existent
      if (!config.typography?.fontFamily) {
        console.warn(`Theme ${theme.name} has invalid typography config, using defaults`)
        return defaultTypography
      }
      return config.typography.fontFamily
    } catch (error) {
      console.error(`Failed to parse theme typography for ${theme.name}:`, error)
      return defaultTypography
    }
  }

  const openCreateEditor = () => {
    setEditingTheme(null)
    setEditorOpen(true)
  }

  const openEditEditor = (theme: Theme) => {
    setEditingTheme(theme)
    setEditorOpen(true)
  }

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Palette className="w-8 h-8" />
            Système de Design
          </h1>
          <p className="text-gray-600">
            Choisissez un thème prédéfini ou créez le vôtre avec le color picker
          </p>
        </div>
        <button
          onClick={openCreateEditor}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all hover:scale-105 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Créer un thème
        </button>
      </div>

      {/* Éditeur de thème */}
      <ThemeEditor
        isOpen={editorOpen}
        onClose={() => {
          setEditorOpen(false)
          setEditingTheme(null)
        }}
        onSave={handleSaveTheme}
        initialData={editingTheme ? {
          displayName: editingTheme.displayName,
          colors: getThemeColors(editingTheme),
          typography: {
            fontFamily: getThemeTypography(editingTheme)
          }
        } : undefined}
        mode={editingTheme ? 'edit' : 'create'}
      />

      {/* Thèmes prédéfinis */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          Thèmes Prédéfinis
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.filter(t => t.isPredefined).map((theme) => {
            const colors = getThemeColors(theme)
            const isActive = theme.isActive
            const isActivating = activating === theme.id

            // Protection contre les données invalides
            if (!colors || !colors.background || !colors.primary || !colors.text) {
              console.error(`Theme ${theme.name} has invalid colors, skipping render`)
              return null
            }

            return (
              <div
                key={theme.id}
                className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                  isActive
                    ? 'border-indigo-500 shadow-xl ring-4 ring-indigo-100'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                }`}
              >
                {/* Badge actif */}
                {isActive && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      <Check className="w-4 h-4" />
                      Actif
                    </div>
                  </div>
                )}

                {/* Preview des couleurs */}
                <div className="h-32 relative overflow-hidden">
                  <div 
                    className="absolute inset-0" 
                    style={{ backgroundColor: colors.background.main }}
                  />
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-20 opacity-50"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-3">
                    <div 
                      className="w-16 h-16 rounded-full shadow-lg"
                      style={{ backgroundColor: colors.primary.main }}
                    />
                    <div 
                      className="w-12 h-12 rounded-full shadow-md"
                      style={{ backgroundColor: colors.primary.light }}
                    />
                    <div 
                      className="w-8 h-8 rounded-full shadow"
                      style={{ backgroundColor: colors.text.secondary }}
                    />
                  </div>
                </div>

                {/* Infos du thème */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {theme.displayName}
                  </h3>
                  
                  {/* Palette de couleurs */}
                  <div className="flex gap-2 mb-4">
                    <div 
                      className="w-8 h-8 rounded-lg border border-gray-200"
                      style={{ backgroundColor: colors.primary.main }}
                      title="Couleur primaire"
                    />
                    <div 
                      className="w-8 h-8 rounded-lg border border-gray-200"
                      style={{ backgroundColor: colors.background.main }}
                      title="Fond principal"
                    />
                    <div 
                      className="w-8 h-8 rounded-lg border border-gray-200"
                      style={{ backgroundColor: colors.text.primary }}
                      title="Texte principal"
                    />
                  </div>

                  {/* Bouton d'activation */}
                  <button
                    onClick={() => activateTheme(theme.id)}
                    disabled={isActive || isActivating}
                    className={`w-full py-2.5 px-4 rounded-full font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isActivating ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Activation...
                      </span>
                    ) : isActive ? (
                      'Thème actif'
                    ) : (
                      'Activer ce thème'
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Thèmes personnalisés */}
      {themes.filter(t => !t.isPredefined).length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Mes Thèmes Personnalisés
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themes.filter(t => !t.isPredefined).map((theme) => {
              const colors = getThemeColors(theme)
              const isActive = theme.isActive
              const isActivating = activating === theme.id

              // Protection contre les données invalides
              if (!colors || !colors.background || !colors.primary || !colors.text) {
                console.error(`Theme ${theme.name} has invalid colors, skipping render`)
                return null
              }

              return (
                <div
                  key={theme.id}
                  className={`relative bg-white rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                    isActive
                      ? 'border-indigo-500 shadow-xl ring-4 ring-indigo-100'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
                  }`}
                >
                  {/* Badge actif */}
                  {isActive && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        <Check className="w-4 h-4" />
                        Actif
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <button
                      onClick={() => openEditEditor(theme)}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => deleteTheme(theme.id)}
                      disabled={isActive}
                      className="p-2 bg-white rounded-lg shadow-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>

                  {/* Preview des couleurs */}
                  <div className="h-32 relative overflow-hidden">
                    <div 
                      className="absolute inset-0" 
                      style={{ backgroundColor: colors.background.main }}
                    />
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-20 opacity-50"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.light} 100%)`
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center gap-3">
                      <div 
                        className="w-16 h-16 rounded-full shadow-lg"
                        style={{ backgroundColor: colors.primary.main }}
                      />
                      <div 
                        className="w-12 h-12 rounded-full shadow-md"
                        style={{ backgroundColor: colors.primary.light }}
                      />
                      <div 
                        className="w-8 h-8 rounded-full shadow"
                        style={{ backgroundColor: colors.text.secondary }}
                      />
                    </div>
                  </div>

                  {/* Infos du thème */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {theme.displayName}
                    </h3>
                    
                    {/* Palette de couleurs */}
                    <div className="flex gap-2 mb-4">
                      <div 
                        className="w-8 h-8 rounded-lg border border-gray-200"
                        style={{ backgroundColor: colors.primary.main }}
                        title="Couleur primaire"
                      />
                      <div 
                        className="w-8 h-8 rounded-lg border border-gray-200"
                        style={{ backgroundColor: colors.background.main }}
                        title="Fond principal"
                      />
                      <div 
                        className="w-8 h-8 rounded-lg border border-gray-200"
                        style={{ backgroundColor: colors.text.primary }}
                        title="Texte principal"
                      />
                    </div>

                    {/* Boutons d'action */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => activateTheme(theme.id)}
                        disabled={isActive || isActivating}
                        className={`flex-1 py-2.5 px-4 rounded-full font-medium transition-all duration-300 ${
                          isActive
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95'
                        }`}
                      >
                        {isActivating ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Activation...
                          </span>
                        ) : isActive ? (
                          'Thème actif'
                        ) : (
                          'Activer'
                        )}
                      </button>
                      <button
                        onClick={() => setPreviewTheme(theme)}
                        className="px-4 py-2.5 border-2 border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors"
                        title="Prévisualiser"
                      >
                        <Sparkles className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex gap-4 justify-center">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-5 h-5" />
            Exporter le thème actif
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <Upload className="w-5 h-5" />
            Importer un thème
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          Les fonctionnalités d'import/export seront disponibles prochainement
        </p>
      </div>

      {/* Modal de prévisualisation */}
      {previewTheme && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setPreviewTheme(null)}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Prévisualisation : {previewTheme.displayName}
                </h3>
                <button
                  onClick={() => setPreviewTheme(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <ThemePreview colors={getThemeColors(previewTheme)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
