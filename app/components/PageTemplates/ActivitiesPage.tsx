'use client'

import { Calendar, ExternalLink, Github, Award, Users } from 'lucide-react'

interface Activity {
  title: string
  description: string
  type: 'project' | 'contribution' | 'speaking' | 'teaching' | 'other'
  date?: string
  link?: string
  image?: string
}

interface ActivitiesContent {
  title: string
  description: string
  activities: Activity[]
}

interface ActivitiesPageProps {
  content: ActivitiesContent
}

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
  switch (type) {
    case 'project':
      return <Github className="w-5 h-5" />
    case 'contribution':
      return <Users className="w-5 h-5" />
    case 'speaking':
      return <Award className="w-5 h-5" />
    case 'teaching':
      return <Award className="w-5 h-5" />
    default:
      return <Calendar className="w-5 h-5" />
  }
}

const ActivityLabel = ({ type }: { type: Activity['type'] }) => {
  const labels = {
    project: 'Projet',
    contribution: 'Contribution',
    speaking: 'Conférence',
    teaching: 'Formation',
    other: 'Autre'
  }
  return labels[type]
}

export function ActivitiesPage({ content }: ActivitiesPageProps) {
  return (
    <div className="min-h-screen bg-theme-main py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre centré */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-primary mb-4">
            {content.title}
          </h1>
          {content.description && (
            <p className="text-xl text-theme-secondary mt-6 max-w-3xl mx-auto">
              {content.description}
            </p>
          )}
          <div className="w-20 h-1 bg-theme-primary mx-auto rounded-full mt-6"></div>
        </div>

        {/* Grille d'activités */}
        {content.activities && content.activities.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {content.activities.map((activity, index) => (
              <div
                key={index}
                className="bg-theme-alt rounded-theme-card border border-theme-main shadow-theme-md hover:shadow-theme-xl transition-theme group"
              >
                {/* Image si disponible */}
                {activity.image && (
                  <div className="aspect-video relative overflow-hidden rounded-t-theme-card">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-6">
                  {/* En-tête avec type et date */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-theme-primary">
                      <ActivityIcon type={activity.type} />
                      <span className="text-sm font-medium">
                        <ActivityLabel type={activity.type} />
                      </span>
                    </div>
                    {activity.date && (
                      <div className="flex items-center gap-1 text-sm text-theme-muted">
                        <Calendar className="w-4 h-4" />
                        <span>{activity.date}</span>
                      </div>
                    )}
                  </div>

                  {/* Titre */}
                  <h3 className="text-xl font-semibold text-theme-primary mb-3 group-hover:text-theme-primary-hover transition-theme">
                    {activity.title}
                  </h3>

                  {/* Description */}
                  <p className="text-theme-secondary leading-relaxed mb-4">
                    {activity.description}
                  </p>

                  {/* Lien si disponible */}
                  {activity.link && (
                    <a
                      href={activity.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-theme-primary hover:text-theme-primary-hover transition-theme font-medium group"
                    >
                      <span>En savoir plus</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-theme-muted bg-theme-alt rounded-theme-card border border-theme-main">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-theme-muted opacity-50" />
            <p>Aucune activité à afficher pour le moment</p>
          </div>
        )}

        {/* Section CTA */}
        {content.activities && content.activities.length > 0 && (
          <div className="mt-16 text-center bg-theme-alt rounded-theme-card border border-theme-main p-12">
            <h2 className="text-2xl font-bold text-theme-primary mb-4">
              Envie de collaborer ?
            </h2>
            <p className="text-theme-secondary mb-6 max-w-2xl mx-auto">
              Je suis toujours intéressé par de nouveaux projets et collaborations. 
              N'hésitez pas à me contacter pour échanger !
            </p>
            <button className="inline-flex items-center px-8 py-4 bg-theme-primary text-theme-inverted rounded-theme-button font-medium hover:bg-theme-primary-hover transition-theme shadow-theme-lg hover-scale-theme">
              Me contacter
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
