import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowRight } from 'lucide-react'

async function getArticles() {
  return await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
  })
}

type Article = Awaited<ReturnType<typeof getArticles>>[number]

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <main className="py-16 pt-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Articles</h1>
            <p className="text-xl text-gray-600">
              Découvrez mes réflexions et partages d'expertise
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article: Article) => (
              <article
                key={article.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="text-sm text-indigo-600 font-medium mb-2">
                    {article.publishedAt &&
                      format(new Date(article.publishedAt), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{article.excerpt}</p>
                  <Link
                    href={`/articles/${article.slug}`}
                    className="inline-flex items-center text-gray-900 hover:text-gray-700 font-medium hover:gap-2 transition-all duration-300"
                  >
                    Lire l'article
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        {articles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun article publié pour le moment
          </div>
        )}
      </div>
    </main>
  )
}