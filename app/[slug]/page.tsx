import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ExperiencesTimeline } from '@/app/components/PageTemplates/ExperiencesTimeline'
import { AboutPage } from '@/app/components/PageTemplates/AboutPage'
import { PrestationsGrid } from '@/app/components/PageTemplates/PrestationsGrid'
import { ActivitiesPage } from '@/app/components/PageTemplates/ActivitiesPage'
import { CoursesPage } from '@/app/components/PageTemplates/CoursesPage'

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

async function getPage(slug: string) {
  try {
    const page = await prisma.page.findUnique({
      where: { 
        slug,
        published: true
      }
    })
    return page
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
}

async function getPrestations() {
  try {
    return await prisma.prestation.findMany({
      where: { published: true },
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    console.error('Error fetching prestations:', error)
    return []
  }
}

async function getExperiences() {
  try {
    return await prisma.experience.findMany({
      orderBy: [{ current: 'desc' }, { startDate: 'desc' }]
    })
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return []
  }
}

async function getCourses() {
  try {
    return await prisma.course.findMany({
      where: { published: true },
      orderBy: [
        { type: 'asc' }, // university avant professional
        { order: 'asc' }
      ]
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params
  const page = await getPage(resolvedParams.slug)

  if (!page) {
    notFound()
  }

  // Parse le contenu JSON
  let content = {}
  try {
    content = JSON.parse(page.content)
  } catch (error) {
    console.error('Error parsing page content:', error)
  }

  // Selon le type de page, charger les données nécessaires et rendre le template approprié
  
  // Page Prestations - Template grille
  if (page.type === 'prestations') {
    const prestations = await getPrestations()
    const parsedPrestations = prestations.map((p: any) => ({
      ...p,
      benefits: JSON.parse(p.benefits || '[]')
    }))
    
    return (
      <PrestationsGrid
        title={page.title}
        intro={(content as any).intro}
        prestations={parsedPrestations}
      />
    )
  }

  // Page Expériences - Template timeline
  if (page.type === 'experiences') {
    const experiences = await getExperiences()
    const formattedExperiences = experiences.map((exp: any) => ({
      id: exp.id,
      title: exp.position,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description
    }))

    return (
      <ExperiencesTimeline
        title={page.title}
        experiences={formattedExperiences}
      />
    )
  }

  // Page À propos - Template photo + texte
  if (page.type === 'about') {
    return <AboutPage content={content as any} />
  }

  // Page Activités - Template activités
  if (page.type === 'activities') {
    return <ActivitiesPage content={content as any} />
  }

  // Page Cours - Template cours universitaires + formations
  if (page.type === 'courses') {
    const courses = await getCourses()
    const universityCourses = courses.filter((c: any) => c.type === 'university')
    const professionalTraining = courses.filter((c: any) => c.type === 'professional')
    
    return (
      <CoursesPage 
        content={{
          title: page.title,
          description: (content as any).description,
          universityCourses,
          professionalTraining
        }} 
      />
    )
  }

  // Page personnalisée - Template simple
  if (page.type === 'custom') {
    const containerClass = page.centered 
      ? 'max-w-4xl mx-auto' 
      : 'max-w-7xl mx-auto'

    return (
      <div className="min-h-screen bg-theme-main py-20">
        <div className={`${containerClass} px-4 sm:px-6 lg:px-8`}>
          {page.centered && (
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold text-theme-primary mb-4">
                {page.title}
              </h1>
              <div className="w-20 h-1 bg-theme-primary mx-auto rounded-full"></div>
            </div>
          )}
          
          {!page.centered && (
            <h1 className="text-4xl md:text-5xl font-bold text-theme-primary mb-8">
              {page.title}
            </h1>
          )}

          <div className="bg-theme-alt rounded-theme-card border border-theme-main p-8 shadow-theme-md">
            <div className="prose prose-lg max-w-none text-theme-secondary">
              {(content as any).html ? (
                <div dangerouslySetInnerHTML={{ __html: (content as any).html }} />
              ) : (
                <p>Contenu à venir...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return notFound()
}
