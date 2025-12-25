import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ArrowRight, Briefcase } from 'lucide-react'
import { SlideshowBackground } from '@/app/components/SlideshowBackground'

export const dynamic = 'force-dynamic'

async function getHomeData() {
  const pageContent = await prisma.pageContent.findMany()
  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })

  // Vérifier si la page Prestations est publiée
  const prestationsPage = await prisma.page.findFirst({
    where: {
      type: 'prestations',
      published: true
    }
  })

  // Charger les prestations seulement si la page est publiée
  const prestations = prestationsPage ? await prisma.prestation.findMany({
    where: { published: true },
    orderBy: { order: 'asc' },
    take: 3,
  }) : []

  const content: Record<string, string> = {}
  for (const item of pageContent) {
    content[item.key] = item.value
  }

  return { content, articles, prestations }
}

type HomeData = Awaited<ReturnType<typeof getHomeData>>
type Article = HomeData['articles'][number]
type Prestation = HomeData['prestations'][number]

export default async function Home() {
  const { content, articles, prestations } = await getHomeData()

  // Déterminer le type de fond
  const bgType = content.home_hero_bg_type || 'gradient'
  const bgImage = content.home_hero_bg_image || ''
  const bgVideo = content.home_hero_bg_video || ''
  const overlayOpacity = parseInt(content.home_hero_overlay_opacity || '50') / 100

  return (
    <main className="bg-theme-main">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background */}
        {bgType === 'gradient' && (
          <div className="absolute inset-0 bg-theme-main" style={{
            background: `linear-gradient(to bottom right, var(--color-bg-main), var(--color-bg-alt))`
          }} />
        )}

        {bgType === 'image' && bgImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${bgImage})` }}
            />
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          </>
        )}

        {bgType === 'slideshow' && content.home_hero_bg_slideshow && (
          <SlideshowBackground
            images={JSON.parse(content.home_hero_bg_slideshow || '[]')}
            overlayOpacity={overlayOpacity}
          />
        )}

        {bgType === 'video' && bgVideo && (
          <>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={bgVideo} type="video/mp4" />
            </video>
            <div
              className="absolute inset-0 bg-black"
              style={{ opacity: overlayOpacity }}
            />
          </>
        )}

        {/* Content */}
        <div className={`relative z-10 text-center max-w-3xl mx-auto ${bgType !== 'gradient' ? 'text-white' : ''}`}>
          <h1 className={`font-heading text-5xl md:text-6xl font-bold mb-4 ${bgType === 'gradient' ? 'text-theme-primary' : 'text-white drop-shadow-lg'}`}>
            {content.home_hero_name || 'Votre Nom'}
          </h1>
          <p className={`font-heading text-2xl md:text-3xl font-semibold mb-6 ${bgType === 'gradient' ? 'text-theme-secondary' : 'text-white drop-shadow-lg'}`}>
            {content.home_hero_title || 'Votre Titre'}
          </p>
          <p className={`text-xl md:text-2xl mb-8 ${bgType === 'gradient' ? 'text-theme-muted' : 'text-gray-100 drop-shadow-lg'}`}>
            {content.home_hero_subtitle || 'Votre phrase de positionnement'}
          </p>
          <Link
            href={content.home_hero_cta_link || '/prestations'}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-theme-button text-theme-inverted bg-theme-primary hover:bg-theme-primary-hover shadow-theme-lg transition-theme hover-scale-theme"
          >
            {content.home_hero_cta_text || 'Découvrir mes services'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Latest Articles Section */}
      {articles.length > 0 && (
        <section className="py-16 bg-theme-main">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-theme-primary mb-4">Derniers Articles</h2>
              <p className="text-theme-muted">Découvrez mes dernières publications</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article: Article) => (
                <article key={article.id} className="bg-theme-alt border border-theme-main rounded-theme-card overflow-hidden hover:shadow-theme-xl hover-scale-theme transition-theme">
                  <div className="p-6">
                    <div className="text-sm text-theme-muted mb-2">
                      {article.publishedAt && format(new Date(article.publishedAt), 'dd MMMM yyyy', { locale: fr })}
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-theme-primary mb-2">
                      {article.title}
                    </h3>
                    <p className="text-theme-secondary mb-4">{article.excerpt}</p>
                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center text-theme-primary hover:text-theme-secondary font-medium transition-theme"
                    >
                      Lire l'article
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                href="/articles"
                className="inline-flex items-center px-6 py-3 border border-theme-main text-base font-medium rounded-theme-button text-theme-primary bg-theme-alt hover:bg-theme-main transition-theme hover-scale-theme"
              >
                Voir tous les articles
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Services Section */}
      {prestations.length > 0 && (
        <section className="py-16 bg-theme-alt">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-4">
                <Briefcase className="h-12 w-12 text-theme-primary" />
              </div>
              <h2 className="font-heading text-3xl font-bold text-theme-primary mb-4">
                {content.home_services_title || 'Mes Prestations'}
              </h2>
              <p className="text-xl text-theme-secondary max-w-2xl mx-auto">
                {content.home_services_intro || 'Découvrez mes services'}
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-10">
              {prestations.map((prestation: Prestation) => {
                const benefits = JSON.parse(prestation.benefits || '[]')
                return (
                  <div key={prestation.id} className="bg-theme-main p-6 rounded-theme-card border border-theme-main hover:shadow-theme-xl hover-scale-theme transition-theme">
                    <h3 className="font-heading text-xl font-semibold text-theme-primary mb-3">
                      {prestation.title}
                    </h3>
                    <p className="text-theme-secondary mb-4">{prestation.description}</p>
                    {prestation.price && (
                      <p className="text-lg font-semibold text-theme-primary mb-4">
                        {prestation.price}
                      </p>
                    )}
                    <ul className="space-y-2">
                      {benefits.slice(0, 3).map((benefit: string, i: number) => (
                        <li key={i} className="flex items-start text-sm text-theme-secondary">
                          <span className="mr-2" style={{ color: 'var(--color-primary)' }}>✓</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            <div className="text-center">
              <Link
                href="/prestations"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-theme-button text-theme-inverted bg-theme-primary hover:bg-theme-primary-hover transition-theme hover-scale-theme shadow-theme-lg"
              >
                {content.home_services_cta_text || 'Découvrir les prestations'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
