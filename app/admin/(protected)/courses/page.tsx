'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, GripVertical, GraduationCap, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface Course {
  id: string
  title: string
  institution: string
  type: 'university' | 'professional'
  level?: string | null
  period?: string | null
  duration?: string | null
  description?: string | null
  order: number
  published: boolean
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    const res = await fetch('/api/courses')
    const data = await res.json()
    setCourses(data)
  }

  const deleteCourse = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) return

    try {
      const res = await fetch('/api/courses', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (res.ok) {
        fetchCourses()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  const togglePublished = async (course: Course) => {
    try {
      const res = await fetch('/api/courses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: course.id,
          published: !course.published
        })
      })

      if (res.ok) {
        fetchCourses()
      } else {
        alert('Erreur lors de la mise à jour')
      }
    } catch (error) {
      alert('Erreur lors de la mise à jour')
    }
  }

  const universityCourses = courses.filter(c => c.type === 'university')
  const professionalCourses = courses.filter(c => c.type === 'professional')

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Cours</h1>
          <p className="text-gray-600 mt-2">Gérez vos cours universitaires et formations professionnelles</p>
        </div>
        <Link
          href="/admin/courses/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nouveau cours
        </Link>
      </div>

      {/* Cours Universitaires */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Cours Universitaires</h2>
          <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            {universityCourses.length}
          </span>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {universityCourses.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun cours universitaire</h3>
              <p className="mt-1 text-sm text-gray-500">Commencez par créer un cours universitaire.</p>
              <div className="mt-6">
                <Link
                  href="/admin/courses/new?type=university"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouveau cours universitaire
                </Link>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {universityCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{course.institution}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{course.level || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{course.period || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublished(course)}
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          course.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {course.published ? 'Publié' : 'Brouillon'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Formations Professionnelles */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">Formations Professionnelles</h2>
          <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            {professionalCourses.length}
          </span>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {professionalCourses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune formation professionnelle</h3>
              <p className="mt-1 text-sm text-gray-500">Commencez par créer une formation.</p>
              <div className="mt-6">
                <Link
                  href="/admin/courses/new?type=professional"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nouvelle formation professionnelle
                </Link>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisme</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {professionalCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{course.institution}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{course.level || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{course.period || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublished(course)}
                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          course.published
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {course.published ? 'Publié' : 'Brouillon'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
