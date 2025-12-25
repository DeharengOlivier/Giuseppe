'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface PrestationFormData {
  title: string
  description: string
  price: string
  benefits: string[]
  order: number
  published: boolean
}

export default function EditPrestationPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [formData, setFormData] = useState<PrestationFormData>({
    title: '',
    description: '',
    price: '',
    benefits: [''],
    order: 0,
    published: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  useEffect(() => {
    if (resolvedParams?.id && resolvedParams.id !== 'new') {
      fetchPrestation(resolvedParams.id)
    } else {
      setLoading(false)
    }
  }, [resolvedParams])

  const fetchPrestation = async (id: string) => {
    try {
      const response = await fetch(`/api/prestations/${id}`)
      const data = await response.json()
      setFormData({
        title: data.title,
        description: data.description,
        price: data.price || '',
        benefits: JSON.parse(data.benefits || '[]'),
        order: data.order,
        published: data.published,
      })
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const isNew = !resolvedParams?.id || resolvedParams.id === 'new'
      const url = isNew ? '/api/prestations' : `/api/prestations/${resolvedParams.id}`
      const method = isNew ? 'POST' : 'PUT'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/admin/prestations')
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setSaving(false)
    }
  }

  const addBenefit = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ''] })
  }

  const removeBenefit = (index: number) => {
    const newBenefits = formData.benefits.filter((_, i) => i !== index)
    setFormData({ ...formData, benefits: newBenefits })
  }

  const updateBenefit = (index: number, value: string) => {
    const newBenefits = [...formData.benefits]
    newBenefits[index] = value
    setFormData({ ...formData, benefits: newBenefits })
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  const isNew = !resolvedParams?.id || resolvedParams.id === 'new'

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/prestations" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux prestations
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {isNew ? 'Nouvelle prestation' : 'Modifier la prestation'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Titre</label>
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
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix (optionnel)</label>
            <input
              type="text"
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Ex: À partir de 3 000€"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bénéfices</label>
            <div className="space-y-2">
              {formData.benefits.map((benefit, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={benefit}
                    onChange={(e) => updateBenefit(index, e.target.value)}
                    placeholder="Bénéfice principal"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
                  />
                  <button
                    type="button"
                    onClick={() => removeBenefit(index)}
                    className="px-3 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addBenefit}
              className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              <Plus className="h-4 w-4 mr-1" />
              Ajouter un bénéfice
            </button>
          </div>

          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700">Ordre d'affichage</label>
            <input
              type="number"
              id="order"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border"
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
              Publier cette prestation
            </label>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/prestations" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
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
