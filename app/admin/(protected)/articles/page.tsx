'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  published: boolean
  publishedAt: string | null
  createdAt: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      const data = await response.json()
      setArticles(data)
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteArticle = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return
    }

    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      fetchArticles()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }

  if (loading) {
    return <div className="text-center py-10">Chargement...</div>
  }

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gérez tous vos articles de blog
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouvel article
          </Link>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {articles.length === 0 ? (
            <li className="px-6 py-10 text-center text-gray-500">
              Aucun article pour le moment
            </li>
          ) : (
            articles.map((article) => (
              <li key={article.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-indigo-600 truncate">
                          {article.title}
                        </h3>
                        {article.published ? (
                          <span title="Publié"><Eye className="h-4 w-4 text-green-500" /></span>
                        ) : (
                          <span title="Brouillon"><EyeOff className="h-4 w-4 text-gray-400" /></span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{article.excerpt}</p>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>
                          {article.publishedAt
                            ? format(new Date(article.publishedAt), 'dd MMMM yyyy', {
                                locale: fr,
                              })
                            : 'Non publié'}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          /{article.slug}
                        </span>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0 flex gap-2">
                      <Link
                        href={`/admin/articles/${article.id}`}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Link>
                      <button
                        onClick={() => deleteArticle(article.id)}
                        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
