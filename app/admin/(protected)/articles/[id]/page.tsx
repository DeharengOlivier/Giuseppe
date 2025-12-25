'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RichTextEditor } from '@/app/admin/components/RichTextEditor'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface ArticleFormData {
  title: string
  excerpt: string
  content: string
  published: boolean
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    excerpt: '',
    content: '',
    published: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (resolvedParams?.id && resolvedParams.id !== 'new') {
      fetchArticle(resolvedParams.id)
    } else {
      setLoading(false)
    }
  }, [resolvedParams])

  const fetchArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/articles/${id}`)
      const data = await response.json()
      setFormData({
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        published: data.published,
      })
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const isNew = !resolvedParams?.id || resolvedParams.id === 'new'
      const url = isNew ? '/api/articles' : `/api/articles/${resolvedParams.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/articles')
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>
  }

  const isNew = !resolvedParams?.id || resolvedParams.id === 'new'

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/articles"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux articles
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {isNew ? 'Nouvel article' : 'Modifier l\'article'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Titre
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                Extrait (résumé court)
              </label>
              <textarea
                id="excerpt"
                required
                rows={3}
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contenu
              </label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData({ ...formData, content })}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                Publier cet article
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link
            href="/admin/articles"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}
