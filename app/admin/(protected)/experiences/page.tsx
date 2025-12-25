'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Experience {
  id: string
  position: string
  company: string
  location: string | null
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  skills: string
}

export default function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/experiences')
      .then(res => res.json())
      .then(setExperiences)
      .finally(() => setLoading(false))
  }, [])

  const deleteExperience = async (id: string) => {
    if (!confirm('Supprimer cette expérience ?')) return
    await fetch(`/api/experiences/${id}`, { method: 'DELETE' })
    setExperiences(experiences.filter(e => e.id !== id))
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Expériences</h1>
        <Link href="/admin/experiences/new" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle expérience
        </Link>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                <p className="text-indigo-600">{exp.company} {exp.location && `• ${exp.location}`}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {format(new Date(exp.startDate), 'MMMM yyyy', { locale: fr })} - {exp.current ? 'Aujourd\'hui' : format(new Date(exp.endDate!), 'MMMM yyyy', { locale: fr })}
                </p>
                <p className="mt-2 text-gray-600">{exp.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {JSON.parse(exp.skills).map((skill: string, i: number) => (
                    <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">{skill}</span>
                  ))}
                </div>
              </div>
              <div className="ml-4 flex gap-2">
                <Link href={`/admin/experiences/${exp.id}`} className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">
                  <Edit className="h-4 w-4" />
                </Link>
                <button onClick={() => deleteExperience(exp.id)} className="px-3 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
