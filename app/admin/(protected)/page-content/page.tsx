'use client'

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { FileUpload } from '@/app/components/FileUpload'
import { MultiImageUpload } from '@/app/components/MultiImageUpload'

export default function PageContentPage() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/page-content')
      .then(res => res.json())
      .then(setContent)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await fetch('/api/page-content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      })
      alert('Contenu mis à jour avec succès !')
    } catch (error) {
      alert('Erreur lors de la mise à jour')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  const sections = {
    'Hero Section': [
      { key: 'home_hero_name', label: 'Nom', type: 'text' },
      { key: 'home_hero_title', label: 'Titre/Rôle', type: 'text' },
      { key: 'home_hero_subtitle', label: 'Phrase de positionnement', type: 'textarea' },
      { key: 'home_hero_cta_text', label: 'Texte du bouton CTA', type: 'text' },
      { key: 'home_hero_cta_link', label: 'Lien du bouton CTA', type: 'text' },
    ],
    'Hero Background': [
      { key: 'home_hero_bg_type', label: 'Type de fond', type: 'select', options: ['gradient', 'image', 'slideshow', 'video'] },
      { key: 'home_hero_bg_image', label: 'Image de fond', type: 'file', accept: 'image', condition: 'home_hero_bg_type', conditionValue: 'image' },
      { key: 'home_hero_bg_slideshow', label: 'Images du diaporama', type: 'multi-file', condition: 'home_hero_bg_type', conditionValue: 'slideshow' },
      { key: 'home_hero_bg_video', label: 'Vidéo de fond', type: 'file', accept: 'video', condition: 'home_hero_bg_type', conditionValue: 'video' },
      { key: 'home_hero_overlay_opacity', label: 'Opacité de l\'overlay (0-100)', type: 'number', help: 'Assombrit le fond pour améliorer la lisibilité du texte' },
    ],
    'Section Services': [
      { key: 'home_services_title', label: 'Titre de la section', type: 'text' },
      { key: 'home_services_intro', label: 'Texte d\'introduction', type: 'textarea' },
      { key: 'home_services_cta_text', label: 'Texte du bouton', type: 'text' },
    ],
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Contenu des pages</h1>
        <p className="mt-2 text-sm text-gray-700">
          Modifiez le contenu textuel de votre site
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {Object.entries(sections).map(([sectionName, fields]) => (
          <div key={sectionName} className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{sectionName}</h2>
            <div className="space-y-4">
              {fields.map((field: any) => {
                // Vérifier la condition d'affichage
                if (field.condition && content[field.condition] !== field.conditionValue) {
                  return null
                }

                return (
                  <div key={field.key}>
                    {field.type === 'file' ? (
                      <FileUpload
                        label={field.label}
                        value={content[field.key] || ''}
                        onChange={(url) => setContent({ ...content, [field.key]: url })}
                        accept={field.accept as 'image' | 'video' | 'both'}
                        help={field.help}
                      />
                    ) : field.type === 'multi-file' ? (
                      <MultiImageUpload
                        label={field.label}
                        images={content[field.key] ? JSON.parse(content[field.key]) : []}
                        onChange={(images) => setContent({ ...content, [field.key]: JSON.stringify(images) })}
                      />
                    ) : (
                      <>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        {field.help && (
                          <p className="text-xs text-gray-500 mb-1">{field.help}</p>
                        )}
                        {field.type === 'textarea' ? (
                          <textarea
                            rows={3}
                            value={content[field.key] || ''}
                            onChange={e => setContent({ ...content, [field.key]: e.target.value })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                          />
                        ) : field.type === 'select' ? (
                          <select
                            value={content[field.key] || field.options?.[0] || ''}
                            onChange={e => setContent({ ...content, [field.key]: e.target.value })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                          >
                            {field.options?.map((opt: string) => (
                              <option key={opt} value={opt}>
                                {opt === 'gradient' ? 'Dégradé' : opt === 'image' ? 'Image' : opt === 'slideshow' ? 'Diaporama' : 'Vidéo'}
                              </option>
                            ))}
                          </select>
                        ) : field.type === 'number' ? (
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={content[field.key] || '50'}
                            onChange={e => setContent({ ...content, [field.key]: e.target.value })}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                          />
                        ) : (
                          <input
                            type="text"
                            value={content[field.key] || ''}
                            onChange={e => setContent({ ...content, [field.key]: e.target.value })}
                            placeholder={field.type === 'text' && field.key.includes('url') ? 'https://...' : ''}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                          />
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  )
}
