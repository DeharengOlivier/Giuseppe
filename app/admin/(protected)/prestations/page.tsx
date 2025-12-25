'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

interface Prestation {
  id: string
  title: string
  description: string
  price: string | null
  benefits: string
  order: number
  published: boolean
}

export default function PrestationsPage() {
  const [prestations, setPrestations] = useState<Prestation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrestations()
  }, [])

  const fetchPrestations = async () => {
    try {
      const response = await fetch('/api/prestations')
      const data = await response.json()
      setPrestations(data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const deletePrestation = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette prestation ?')) return
    try {
      await fetch(`/api/prestations/${id}`, { method: 'DELETE' })
      fetchPrestations()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Prestations</h1>
        <Link
          href="/admin/prestations/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle prestation
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {prestations.map((prestation) => {
          const benefits = JSON.parse(prestation.benefits || '[]')
          return (
            <div key={prestation.id} className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">{prestation.title}</h3>
              <p className="mt-2 text-sm text-gray-500">{prestation.description}</p>
              {prestation.price && (
                <p className="mt-2 text-lg font-semibold text-indigo-600">{prestation.price}</p>
              )}
              <ul className="mt-3 space-y-1">
                {benefits.slice(0, 3).map((benefit: string, i: number) => (
                  <li key={i} className="text-sm text-gray-600">• {benefit}</li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                <Link
                  href={`/admin/prestations/${prestation.id}`}
                  className="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Link>
                <button
                  onClick={() => deletePrestation(prestation.id)}
                  className="px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
