import Link from 'next/link'
import { FileText, Briefcase, Calendar, Eye, Palette } from 'lucide-react'

export default async function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Link
          href="/admin/articles"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Articles
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Gérer les articles
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/prestations"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Prestations
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Gérer les prestations
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/experiences"
          className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Expériences
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    Gérer les expériences
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/design-system"
          className="bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-all hover:scale-105"
        >
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Palette className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-indigo-100 truncate">
                    Design System
                  </dt>
                  <dd className="text-lg font-medium text-white">
                    Changer le thème
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Actions rapides
        </h2>
        <div className="space-y-3">
          <Link
            href="/"
            className="flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <Eye className="h-5 w-5 mr-2" />
            Voir le site public
          </Link>
          <Link
            href="/admin/page-content"
            className="flex items-center text-indigo-600 hover:text-indigo-900"
          >
            Modifier le contenu des pages
          </Link>
          <Link
            href="/admin/design-system"
            className="flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <Palette className="h-5 w-5 mr-2" />
            Personnaliser le design
          </Link>
        </div>
      </div>
    </div>
  )
}
