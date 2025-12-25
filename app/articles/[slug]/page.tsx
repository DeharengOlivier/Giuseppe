import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

async function getArticle(slug: string) {
  return await prisma.article.findUnique({
    where: { slug, published: true },
  })
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  return (
    <main className="py-16 pt-24 bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/articles"
            className="inline-flex items-center text-gray-900 hover:text-gray-700 mb-8 hover:gap-3 transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux articles
          </Link>

          <header className="mb-8 bg-white p-8 rounded-2xl border border-gray-200">
            <div className="text-sm text-gray-600 font-medium mb-3">
              {article.publishedAt &&
                format(new Date(article.publishedAt), 'dd MMMM yyyy', { locale: fr })}
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            <p className="text-xl text-gray-600">{article.excerpt}</p>
          </header>

        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-gray-900 hover:prose-a:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 bg-white p-8 rounded-2xl border border-gray-200"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />
      </article>
    </main>
  )
}