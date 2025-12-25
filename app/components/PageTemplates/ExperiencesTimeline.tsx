'use client'

import { Calendar, MapPin, Briefcase } from 'lucide-react'

interface Experience {
  id: string
  title: string
  company: string
  location?: string
  startDate: Date
  endDate?: Date
  current: boolean
  description: string
}

interface ExperiencesTimelineProps {
  title: string
  experiences: Experience[]
}

export function ExperiencesTimeline({ title, experiences }: ExperiencesTimelineProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', { month: 'short', year: 'numeric' }).format(new Date(date))
  }

  const calculateDuration = (start: Date, end: Date | null) => {
    const startDate = new Date(start)
    const endDate = end ? new Date(end) : new Date()
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth())
    const years = Math.floor(months / 12)
    const remainingMonths = months % 12

    if (years > 0 && remainingMonths > 0) {
      return `${years} an${years > 1 ? 's' : ''} ${remainingMonths} mois`
    } else if (years > 0) {
      return `${years} an${years > 1 ? 's' : ''}`
    } else {
      return `${remainingMonths} mois`
    }
  }

  return (
    <div className="min-h-screen bg-theme-main pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre centré */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-primary mb-4">
            {title}
          </h1>
          <div className="w-20 h-1 bg-theme-primary mx-auto rounded-full"></div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Ligne verticale centrale */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-theme-border transform md:-translate-x-1/2"></div>

          {/* Expériences */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={exp.id} className="relative">
                {/* Point sur la timeline */}
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-theme-primary rounded-full transform -translate-x-1/2 border-4 border-theme-main z-10"></div>

                {/* Contenu - alternance gauche/droite sur desktop */}
                <div className={`ml-16 md:ml-0 md:w-5/12 ${index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'}`}>
                  <div className="bg-theme-alt p-6 rounded-theme-card border border-theme-main shadow-theme-md hover:shadow-theme-xl transition-theme">
                    {/* En-tête */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-theme-primary/10 rounded-lg">
                        <Briefcase className="w-5 h-5 text-theme-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-theme-primary mb-1">
                          {exp.title}
                        </h3>
                        <p className="text-theme-secondary font-medium">
                          {exp.company}
                        </p>
                      </div>
                    </div>

                    {/* Détails */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-theme-muted">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(exp.startDate)} - {exp.current ? 'Présent' : formatDate(exp.endDate!)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-theme-muted">
                        <span>•</span>
                        <span>{calculateDuration(exp.startDate, exp.endDate || null)}</span>
                      </div>
                      {exp.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{exp.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-theme-secondary leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Badge "En cours" */}
                    {exp.current && (
                      <div className="mt-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-theme-primary text-theme-inverted">
                          En cours
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message si aucune expérience */}
        {experiences.length === 0 && (
          <div className="text-center py-12 text-theme-muted">
            Aucune expérience à afficher pour le moment
          </div>
        )}
      </div>
    </div>
  )
}
