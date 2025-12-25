'use client'

import { GraduationCap, BookOpen, Calendar, Clock } from 'lucide-react'

interface Course {
  id?: string
  title: string
  institution: string
  type?: string
  level?: string | null
  duration?: string | null
  period?: string | null
  description?: string | null
}

interface CoursesContent {
  title: string
  description?: string
  universityCourses: Course[]
  professionalTraining: Course[]
}

interface CoursesPageProps {
  content: CoursesContent
}

export function CoursesPage({ content }: CoursesPageProps) {
  return (
    <div className="min-h-screen bg-theme-main pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre centré */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-primary mb-4">
            {content.title}
          </h1>
          <div className="w-20 h-1 bg-theme-primary mx-auto rounded-full"></div>
          {content.description && (
            <p className="text-lg text-theme-secondary mt-6 max-w-3xl mx-auto">
              {content.description}
            </p>
          )}
        </div>

        {/* Section Cours Universitaires */}
        {content.universityCourses && content.universityCourses.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="w-8 h-8 text-theme-primary" />
              <h2 className="text-3xl font-bold text-theme-primary">
                Cours Universitaires
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {content.universityCourses.map((course, index) => (
                <div
                  key={index}
                  className="bg-theme-alt p-6 rounded-theme-card border border-theme-main hover:shadow-theme-xl transition-theme"
                >
                  <h3 className="text-xl font-semibold text-theme-primary mb-2">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-2 text-theme-secondary mb-3">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">{course.institution}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-3">
                    {course.level && (
                      <div className="flex items-center gap-1 text-sm text-theme-muted">
                        <span className="px-2 py-1 bg-theme-main rounded-theme-card border border-theme-border">
                          {course.level}
                        </span>
                      </div>
                    )}

                    {course.period && (
                      <div className="flex items-center gap-1 text-sm text-theme-muted">
                        <Calendar className="w-4 h-4" />
                        <span>{course.period}</span>
                      </div>
                    )}

                    {course.duration && (
                      <div className="flex items-center gap-1 text-sm text-theme-muted">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                  </div>

                  {course.description && (
                    <p className="text-theme-secondary text-sm leading-relaxed">
                      {course.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Formations Professionnelles */}
        {content.professionalTraining && content.professionalTraining.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="w-8 h-8 text-theme-primary" />
              <h2 className="text-3xl font-bold text-theme-primary">
                Formations Professionnelles
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {content.professionalTraining.map((course, index) => (
                <div
                  key={index}
                  className="bg-theme-alt p-6 rounded-theme-card border border-theme-main hover:shadow-theme-xl transition-theme"
                >
                  <h3 className="text-xl font-semibold text-theme-primary mb-2">
                    {course.title}
                  </h3>

                  <div className="flex items-center gap-2 text-theme-secondary mb-3">
                    <BookOpen className="w-4 h-4" />
                    <span className="font-medium">{course.institution}</span>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-3">
                    {course.level && (
                      <div className="flex items-center gap-1 text-sm text-theme-muted">
                        <span className="px-2 py-1 bg-theme-main rounded-theme-card border border-theme-border">
                          {course.level}
                        </span>
                      </div>
                    )}

                    {course.period && (
                      <div className="flex items-center gap-1 text-sm text-theme-muted">
                        <Calendar className="w-4 h-4" />
                        <span>{course.period}</span>
                      </div>
                    )}

                    {course.duration && (
                      <div className="flex items-center gap-1 text-sm text-theme-muted">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                  </div>

                  {course.description && (
                    <p className="text-theme-secondary text-sm leading-relaxed">
                      {course.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message si aucun contenu */}
        {(!content.universityCourses || content.universityCourses.length === 0) &&
          (!content.professionalTraining || content.professionalTraining.length === 0) && (
            <div className="text-center py-16">
              <GraduationCap className="w-16 h-16 mx-auto mb-4 text-theme-muted" />
              <p className="text-theme-muted text-lg">
                Aucun cours ou formation disponible pour le moment
              </p>
            </div>
          )}
      </div>
    </div>
  )
}
