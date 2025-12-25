'use client'

import { useState, useEffect } from 'react'
import { Globe, TrendingUp, Calendar, MapPin } from 'lucide-react'

interface Visit {
  _id: string
  ip: string
  page: string
  country: string
  city: string
  region: string
  timezone: string
  userAgent: string
  referer: string
  timestamp: string
}

interface Stats {
  byCountry: Array<{ _id: string; count: number }>
  byPage: Array<{ _id: string; count: number }>
  byDay: Array<{ _id: string; count: number }>
  last24h: number
  last7days: number
  total: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<{ page?: string; country?: string }>({})

  useEffect(() => {
    fetchStats()
    fetchVisits()
  }, [filter])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/analytics/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const fetchVisits = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filter.page) params.append('page', filter.page)
      if (filter.country) params.append('country', filter.country)
      params.append('limit', '50')

      const response = await fetch(`/api/analytics?${params}`)
      const data = await response.json()
      setVisits(data.visits)
    } catch (error) {
      console.error('Error fetching visits:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement des statistiques...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>

      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Dernières 24h</p>
              <p className="text-3xl font-bold text-gray-900">{stats.last24h}</p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">7 derniers jours</p>
              <p className="text-3xl font-bold text-gray-900">{stats.last7days}</p>
            </div>
            <Calendar className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total visites</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Globe className="w-12 h-12 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top pays */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Top 10 Pays
          </h2>
          <div className="space-y-3">
            {stats.byCountry.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700">
                  {item._id === 'unknown' ? 'Inconnu' : item._id}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(item.count / stats.byCountry[0].count) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-gray-900 font-medium w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top pages */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Top 10 Pages
          </h2>
          <div className="space-y-3">
            {stats.byPage.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-700 truncate max-w-[200px]">
                  {item._id}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(item.count / stats.byPage[0].count) * 100}%`
                      }}
                    />
                  </div>
                  <span className="text-gray-900 font-medium w-12 text-right">
                    {item.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Visites par jour */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Visites par jour (7 derniers jours)
        </h2>
        <div className="flex items-end justify-between gap-2 h-48">
          {stats.byDay.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="flex-1 w-full flex items-end">
                <div
                  className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors"
                  style={{
                    height: `${(item.count / Math.max(...stats.byDay.map(d => d.count))) * 100}%`,
                    minHeight: '20px'
                  }}
                  title={`${item.count} visites`}
                />
              </div>
              <div className="text-xs text-gray-600 text-center">
                {new Date(item._id).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })}
              </div>
              <div className="text-sm font-medium text-gray-900">{item.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Liste des visites récentes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Visites récentes</h2>
          <div className="mt-4 flex gap-4">
            <select
              value={filter.page || ''}
              onChange={(e) => setFilter({ ...filter, page: e.target.value || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Toutes les pages</option>
              {stats.byPage.map((item) => (
                <option key={item._id} value={item._id}>
                  {item._id}
                </option>
              ))}
            </select>
            <select
              value={filter.country || ''}
              onChange={(e) => setFilter({ ...filter, country: e.target.value || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Tous les pays</option>
              {stats.byCountry.map((item) => (
                <option key={item._id} value={item._id}>
                  {item._id === 'unknown' ? 'Inconnu' : item._id}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date/Heure
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Page
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pays
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ville
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referer
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Chargement...
                  </td>
                </tr>
              ) : visits.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Aucune visite trouvée
                  </td>
                </tr>
              ) : (
                visits.map((visit) => (
                  <tr key={visit._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(visit.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visit.page}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                      {visit.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visit.country === 'unknown' ? 'Inconnu' : visit.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {visit.city === 'unknown' ? '-' : visit.city}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                      {visit.referer === 'direct' ? 'Direct' : visit.referer}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
