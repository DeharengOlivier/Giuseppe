'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'
import Link from 'next/link'

interface ExperienceFormData {
  position: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  skills: string[]
  order: number
}

export default function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const [formData, setFormData] = useState<ExperienceFormData>({
    position: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    skills: [''],
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
      fetch(`/api/experiences/${resolvedParams.id}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            position: data.position,
            company: data.company,
            location: data.location || '',
            startDate: data.startDate.split('T')[0],
            endDate: data.endDate ? data.endDate.split('T')[0] : '',
            current: data.current,
            description: data.description,
            skills: JSON.parse(data.skills || '[]'),
            order: data.order,
          })
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
    const url = isNew ? '/api/experiences' : `/api/experiences/${resolvedParams.id}`
    const method = isNew ? 'POST' : 'PUT'

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    router.push('/admin/experiences')
  }

  const addSkill = () => setFormData({ ...formData, skills: [...formData.skills, ''] })
  const removeSkill = (i: number) => setFormData({ ...formData, skills: formData.skills.filter((_, idx) => idx !== i) })
  const updateSkill = (i: number, value: string) => {
    const newSkills = [...formData.skills]
    newSkills[i] = value
    setFormData({ ...formData, skills: newSkills })
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/experiences" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour aux expériences
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-gray-900">
          {(!resolvedParams?.id || resolvedParams.id === 'new') ? 'Nouvelle expérience' : 'Modifier l\'expérience'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Poste</label>
              <input type="text" required value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Entreprise</label>
              <input type="text" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lieu</label>
            <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Ex: Paris, France" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border" />
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de début</label>
              <input type="date" required value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date de fin</label>
              <input type="date" disabled={formData.current} value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border disabled:bg-gray-100" />
              <div className="mt-2 flex items-center">
                <input type="checkbox" checked={formData.current} onChange={e => setFormData({...formData, current: e.target.checked, endDate: ''})} className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                <label className="ml-2 text-sm text-gray-900">Poste actuel</label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compétences</label>
            <div className="space-y-2">
              {formData.skills.map((skill, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={skill} onChange={e => updateSkill(i, e.target.value)} placeholder="Compétence" className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border" />
                  <button type="button" onClick={() => removeSkill(i)} className="px-3 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addSkill} className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
              <Plus className="h-4 w-4 mr-1" />
              Ajouter une compétence
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ordre d'affichage</label>
            <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 border" />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/experiences" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Annuler
          </Link>
          <button type="submit" disabled={saving} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  )
}
