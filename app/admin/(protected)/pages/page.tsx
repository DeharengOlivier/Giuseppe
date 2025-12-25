'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X, FileText, Upload, AlertCircle } from 'lucide-react'
import { pageEvents } from '@/app/lib/pageEvents'
import { FileUpload } from '@/app/components/FileUpload'

interface Page {
  id: string
  title: string
  slug: string
  type: string
  content: string
  published: boolean
  showInNav: boolean
  showInFooter: boolean
  icon: string | null
  order: number
  centered?: boolean
}

export default function PagesManagementPage() {
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPage, setEditingPage] = useState<Page | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      const res = await fetch('/api/pages')
      const data = await res.json()
      setPages(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const createPage = () => {
    setIsCreating(true)
    setEditingPage({
      id: '',
      title: '',
      slug: '',
      type: 'custom',
      content: JSON.stringify({ html: '' }),
      published: false,
      showInNav: true,
      showInFooter: false,
      icon: null,
      order: pages.length,
      centered: true
    })
  }

  const savePage = async () => {
    if (!editingPage) return

    try {
      const method = isCreating ? 'POST' : 'PUT'
      const res = await fetch('/api/pages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingPage)
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Erreur lors de la sauvegarde')
        return
      }

      // Émettre événement de changement
      if (isCreating) {
        pageEvents.pageCreated(editingPage.id, editingPage.slug)
      } else {
        pageEvents.pageUpdated(editingPage.id, editingPage.slug)
      }

      await loadPages()
      setEditingPage(null)
      setIsCreating(false)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const deletePage = async (id: string) => {
    const page = pages.find(p => p.id === id)
    if (!page) return

    // Vérifier si c'est une page protégée
    const protectedTypes = ['prestations', 'experiences', 'about', 'activities', 'courses']
    if (protectedTypes.includes(page.type)) {
      alert('Cette page système ne peut pas être supprimée. Vous pouvez seulement la dépublier.')
      return
    }

    if (!confirm('Êtes-vous sûr de vouloir supprimer cette page ?')) return

    try {
      const res = await fetch('/api/pages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      
      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Erreur lors de la suppression')
        return
      }
      
      // Émettre événement de suppression
      pageEvents.pageDeleted(id, page.slug)
      
      await loadPages()
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const togglePublished = async (page: Page) => {
    try {
      await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...page, published: !page.published })
      })
      
      // Émettre événement de mise à jour
      pageEvents.pageUpdated(page.id, page.slug)
      
      await loadPages()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  const pageTypes = [
    { value: 'prestations', label: 'Prestations (grille)', protected: true },
    { value: 'experiences', label: 'Expériences (timeline)', protected: true },
    { value: 'about', label: 'À propos (photo + texte)', protected: true },
    { value: 'activities', label: 'Mes Activités', protected: true },
    { value: 'courses', label: 'Cours (université + formations)', protected: true },
    { value: 'custom', label: 'Page personnalisée', protected: false }
  ]

  // Helper pour parser le contenu JSON
  const parseContent = (content: string) => {
    try {
      return JSON.parse(content)
    } catch {
      return {}
    }
  }

  // Helper pour mettre à jour le contenu
  const updateContent = (updates: any) => {
    if (!editingPage) return
    const currentContent = parseContent(editingPage.content)
    const newContent = { ...currentContent, ...updates }
    setEditingPage({ ...editingPage, content: JSON.stringify(newContent) })
  }

  const currentContent = editingPage ? parseContent(editingPage.content) : {}

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Pages</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez toutes les pages de votre site
          </p>
        </div>
        <button
          onClick={createPage}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle page
        </button>
      </div>

      {/* Modal d'édition */}
      {editingPage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isCreating ? 'Nouvelle page' : 'Modifier la page'}
                </h2>
                <button onClick={() => {
                  setEditingPage(null)
                  setIsCreating(false)
                }} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Informations de base */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Titre de la page *
                    </label>
                    <input
                      type="text"
                      value={editingPage.title}
                      onChange={e => setEditingPage({...editingPage, title: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Mon titre"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Slug (URL) *
                    </label>
                    <input
                      type="text"
                      value={editingPage.slug}
                      onChange={e => setEditingPage({...editingPage, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono"
                      placeholder="mon-slug"
                      disabled={!isCreating && pageTypes.find(t => t.value === editingPage.type)?.protected}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL: /{editingPage.slug || 'mon-slug'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de page
                  </label>
                  <select
                    value={editingPage.type}
                    onChange={e => setEditingPage({...editingPage, type: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={!isCreating}
                  >
                    {pageTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} {type.protected ? '🔒' : ''}
                      </option>
                    ))}
                  </select>
                  {!isCreating && pageTypes.find(t => t.value === editingPage.type)?.protected && (
                    <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-800">
                        Page système protégée. Le type et le slug ne peuvent pas être modifiés.
                      </p>
                    </div>
                  )}
                </div>

                {/* Éditeur de contenu selon le type */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenu de la page</h3>
                  
                  {/* Contenu pour À propos */}
                  {editingPage.type === 'about' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description / Bio
                        </label>
                        <textarea
                          value={currentContent.description || ''}
                          onChange={e => updateContent({ description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                          placeholder="Parlez de vous..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Photo de profil
                        </label>
                        <FileUpload
                          label=""
                          value={currentContent.photo || ''}
                          onChange={(url) => updateContent({ photo: url })}
                          accept="image"
                        />
                        <p className="text-xs text-gray-500 mt-1">Photo affichée à droite du texte</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Poste / Rôle
                          </label>
                          <input
                            type="text"
                            value={currentContent.role || ''}
                            onChange={e => updateContent({ role: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Développeur Full-Stack"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Localisation
                          </label>
                          <input
                            type="text"
                            value={currentContent.location || ''}
                            onChange={e => updateContent({ location: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            placeholder="Paris, France"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={currentContent.email || ''}
                          onChange={e => updateContent({ email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="contact@exemple.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Compétences (une par ligne)
                        </label>
                        <textarea
                          value={(currentContent.skills || []).join('\n')}
                          onChange={e => updateContent({ skills: e.target.value.split('\n').filter(s => s.trim()) })}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="JavaScript&#10;React&#10;Node.js"
                        />
                      </div>

                      {/* Formation */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Formation
                        </label>
                        <div className="space-y-3">
                          {(currentContent.education || []).map((edu: any, index: number) => (
                            <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Diplôme
                                  </label>
                                  <input
                                    type="text"
                                    value={edu.degree || ''}
                                    onChange={e => {
                                      const updated = [...(currentContent.education || [])]
                                      updated[index] = { ...updated[index], degree: e.target.value }
                                      updateContent({ education: updated })
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="Master en Informatique"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Année
                                  </label>
                                  <input
                                    type="text"
                                    value={edu.year || ''}
                                    onChange={e => {
                                      const updated = [...(currentContent.education || [])]
                                      updated[index] = { ...updated[index], year: e.target.value }
                                      updateContent({ education: updated })
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="2020"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  École / Université
                                </label>
                                <input
                                  type="text"
                                  value={edu.school || ''}
                                  onChange={e => {
                                    const updated = [...(currentContent.education || [])]
                                    updated[index] = { ...updated[index], school: e.target.value }
                                    updateContent({ education: updated })
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  placeholder="Université Paris-Saclay"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...(currentContent.education || [])]
                                  updated.splice(index, 1)
                                  updateContent({ education: updated })
                                }}
                                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Supprimer cette formation
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(currentContent.education || []), { degree: '', school: '', year: '' }]
                            updateContent({ education: updated })
                          }}
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter une formation
                        </button>
                      </div>

                      {/* Certifications */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certifications
                        </label>
                        <div className="space-y-3">
                          {(currentContent.certifications || []).map((cert: any, index: number) => (
                            <div key={index} className="border border-gray-300 rounded-lg p-4 space-y-3 bg-gray-50">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Nom de la certification
                                  </label>
                                  <input
                                    type="text"
                                    value={cert.name || ''}
                                    onChange={e => {
                                      const updated = [...(currentContent.certifications || [])]
                                      updated[index] = { ...updated[index], name: e.target.value }
                                      updateContent({ certifications: updated })
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="AWS Certified Solutions Architect"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Année
                                  </label>
                                  <input
                                    type="text"
                                    value={cert.year || ''}
                                    onChange={e => {
                                      const updated = [...(currentContent.certifications || [])]
                                      updated[index] = { ...updated[index], year: e.target.value }
                                      updateContent({ certifications: updated })
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                    placeholder="2023"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">
                                  Organisme émetteur
                                </label>
                                <input
                                  type="text"
                                  value={cert.issuer || ''}
                                  onChange={e => {
                                    const updated = [...(currentContent.certifications || [])]
                                    updated[index] = { ...updated[index], issuer: e.target.value }
                                    updateContent({ certifications: updated })
                                  }}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  placeholder="Amazon Web Services"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = [...(currentContent.certifications || [])]
                                  updated.splice(index, 1)
                                  updateContent({ certifications: updated })
                                }}
                                className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" />
                                Supprimer cette certification
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(currentContent.certifications || []), { name: '', issuer: '', year: '' }]
                            updateContent({ certifications: updated })
                          }}
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          <Plus className="w-4 h-4" />
                          Ajouter une certification
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Contenu pour Prestations */}
                  {editingPage.type === 'prestations' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Introduction (optionnel)
                        </label>
                        <textarea
                          value={currentContent.intro || ''}
                          onChange={e => updateContent({ intro: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Texte d'introduction pour vos prestations..."
                        />
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          ℹ️ Les prestations sont gérées dans la section "Prestations" du menu admin.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Contenu pour Expériences */}
                  {editingPage.type === 'experiences' && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        ℹ️ Les expériences sont gérées dans la section "Expériences" du menu admin.
                      </p>
                    </div>
                  )}

                  {/* Contenu pour Activités */}
                  {editingPage.type === 'activities' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={currentContent.description || ''}
                          onChange={e => updateContent({ description: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Découvrez mes projets et contributions..."
                        />
                      </div>
                      <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                          ⚠️ La gestion des activités sera disponible prochainement. Pour l'instant, modifiez le JSON directement.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Contenu pour Cours */}
                  {editingPage.type === 'courses' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description générale (optionnel)
                        </label>
                        <textarea
                          value={currentContent.description || ''}
                          onChange={e => updateContent({ description: e.target.value })}
                          rows={2}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          placeholder="Présentation de vos cours et formations..."
                        />
                      </div>
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          ℹ️ Les cours sont gérés dans la section "Cours" du menu admin.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Contenu pour pages custom */}
                  {editingPage.type === 'custom' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contenu HTML
                        </label>
                        <textarea
                          value={currentContent.html || ''}
                          onChange={e => updateContent({ html: e.target.value })}
                          rows={12}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                          placeholder="<p>Votre contenu HTML ici...</p>"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Utilisez du HTML standard. Les classes Tailwind sont supportées.
                        </p>
                      </div>

                      <label className="flex items-center gap-2 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={editingPage.centered ?? true}
                          onChange={e => setEditingPage({...editingPage, centered: e.target.checked})}
                          className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-700">Contenu centré</span>
                          <p className="text-xs text-gray-500">Centrer le titre et limiter la largeur du contenu</p>
                        </div>
                      </label>
                    </div>
                  )}
                </div>

                {/* Options de publication */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Options d'affichage</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <label className="flex items-center gap-2 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={editingPage.published}
                        onChange={e => setEditingPage({...editingPage, published: e.target.checked})}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {editingPage.published ? '✅ Publié' : '📝 Brouillon'}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={editingPage.showInNav}
                        onChange={e => setEditingPage({...editingPage, showInNav: e.target.checked})}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Navbar</span>
                    </label>

                    <label className="flex items-center gap-2 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={editingPage.showInFooter}
                        onChange={e => setEditingPage({...editingPage, showInFooter: e.target.checked})}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Footer</span>
                    </label>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={savePage}
                    className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Enregistrer
                  </button>
                  <button
                    onClick={() => {
                      setEditingPage(null)
                      setIsCreating(false)
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des pages */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affichage</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Aucune page créée</p>
                  <button
                    onClick={createPage}
                    className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    Créer votre première page
                  </button>
                </td>
              </tr>
            ) : (
              pages.map((page) => {
                const isProtected = pageTypes.find(t => t.value === page.type)?.protected
                return (
                  <tr key={page.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{page.title}</span>
                        {isProtected && (
                          <span className="text-xs">🔒</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                        {pageTypes.find(t => t.value === page.type)?.label || page.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-xs text-gray-600">/{page.slug}</code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => togglePublished(page)}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          page.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {page.published ? (
                          <><Eye className="w-3 h-3" /> Publié</>
                        ) : (
                          <><EyeOff className="w-3 h-3" /> Brouillon</>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {page.showInNav && (
                          <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">Nav</span>
                        )}
                        {page.showInFooter && (
                          <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-700">Footer</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => {
                            setEditingPage(page)
                            setIsCreating(false)
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {!isProtected && (
                          <button
                            onClick={() => deletePage(page.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
