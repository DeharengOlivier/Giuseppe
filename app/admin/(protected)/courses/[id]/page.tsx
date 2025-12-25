'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'

interface CourseFormData {
  title: string
  institution: string
  type: 'university' | 'professional'
  level: string
  period: string
  duration: string
  description: string
  published: boolean
  order: number
}

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const searchParams = useSearchParams()
  const defaultType = searchParams.get('type') as 'university' | 'professional' || 'university'
  
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    institution: '',
    type: defaultType,
    level: '',
    period: '',
    duration: '',
    description: '',
    published: true,
    order: 0,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (resolvedParams?.id && resolvedParams.id !== 'new') {
      fetch(`/api/courses?id=${resolvedParams.id}`)
        .then(res => res.json())
        .then(data => {
          const courses = Array.isArray(data) ? data : [data]
          const course = courses.find((c: any) => c.id === resolvedParams.id)
          if (course) {
            setFormData({
              title: course.title,
              institution: course.institution,
              type: course.type,
              level: course.level || '',
              period: course.period || '',
              duration: course.duration || '',
              description: course.description || '',
              published: course.published,
              order: course.order,
            })
          }
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [resolvedParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const isNew = !resolvedParams?.id || resolvedParams.id === 'new'
    const url = '/api/courses'
    const method = isNew ? 'POST' : 'PUT'

    const body = isNew ? formData : { ...formData, id: resolvedParams?.id }

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    router.push('/admin/courses')
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  const isNew = !resolvedParams?.id || resolvedParams.id === 'new'

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/courses" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux cours
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {isNew ? 'Nouveau cours' : 'Modifier le cours'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg">
        <div className="p-6 space-y-6">
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de cours *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="university"
                  checked={formData.type === 'university'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'university' })}
                  className="mr-2"
                  required
                />
                <span className="text-sm text-gray-700">Cours Universitaire</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="professional"
                  checked={formData.type === 'professional'}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'professional' })}
                  className="mr-2"
                  required
                />
                <span className="text-sm text-gray-700">Formation Professionnelle</span>
              </label>
            </div>
          </div>

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du cours *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={formData.type === 'university' ? "Algorithmes et Structures de Données" : "React Avancé"}
              required
            />
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formData.type === 'university' ? 'Université / École' : 'Organisme de formation'} *
            </label>
            <input
              type="text"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={formData.type === 'university' ? "Université Paris-Saclay" : "OpenClassrooms"}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Niveau */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau
              </label>
              <input
                type="text"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder={formData.type === 'university' ? "Master 2" : "Avancé"}
              />
            </div>

            {/* Période */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période
              </label>
              <input
                type="text"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="2023-2024"
              />
            </div>

            {/* Durée */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="40h"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Description du cours..."
            />
          </div>

          {/* Publié */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Publier ce cours
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <Link
            href="/admin/courses"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}
