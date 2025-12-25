'use client'

import Image from 'next/image'
import { Mail, MapPin, Briefcase, Award } from 'lucide-react'

interface AboutContent {
  title: string
  description: string
  photo?: string
  email?: string
  location?: string
  role?: string
  skills?: string[]
  education?: Array<{ degree: string; school: string; year: string }>
  certifications?: Array<{ name: string; issuer: string; year: string }>
}

interface AboutPageProps {
  content: AboutContent
}

export function AboutPage({ content }: AboutPageProps) {
  return (
    <div className="min-h-screen bg-theme-main pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre centré */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-primary mb-4">
            {content.title}
          </h1>
          <div className="w-20 h-1 bg-theme-primary mx-auto rounded-full"></div>
        </div>

        {/* Section principale : Texte à gauche, Photo à droite */}
        <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
          {/* Texte à gauche */}
          <div className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="text-theme-secondary leading-relaxed text-lg">
                {content.description}
              </p>
            </div>

            {/* Informations de contact */}
            <div className="space-y-3 pt-6 border-t border-theme-border">
              {content.role && (
                <div className="flex items-center gap-3 text-theme-secondary">
                  <Briefcase className="w-5 h-5 text-theme-primary" />
                  <span>{content.role}</span>
                </div>
              )}
              {content.location && (
                <div className="flex items-center gap-3 text-theme-secondary">
                  <MapPin className="w-5 h-5 text-theme-primary" />
                  <span>{content.location}</span>
                </div>
              )}
              {content.email && (
                <div className="flex items-center gap-3 text-theme-secondary">
                  <Mail className="w-5 h-5 text-theme-primary" />
                  <a
                    href={`mailto:${content.email}`}
                    className="hover:text-theme-primary transition-theme"
                  >
                    {content.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Photo à droite */}
          <div className="relative">
            <div className="aspect-[3/4] relative rounded-theme-card overflow-hidden shadow-theme-xl border border-theme-main">
              {content.photo ? (
                <Image
                  src={content.photo}
                  alt={content.title}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-theme-alt flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-theme-primary/10 flex items-center justify-center">
                      <span className="text-4xl text-theme-primary">👤</span>
                    </div>
                    <p className="text-theme-muted">Photo de profil</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compétences */}
        {content.skills && content.skills.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-theme-primary mb-6 flex items-center gap-2">
              <Award className="w-6 h-6" />
              Compétences
            </h2>
            <div className="flex flex-wrap gap-3">
              {content.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-theme-alt border border-theme-main rounded-theme-card text-theme-secondary hover:border-theme-primary hover:text-theme-primary transition-theme"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Formation */}
        {content.education && content.education.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-theme-primary mb-6">
              Formation
            </h2>
            <div className="space-y-4">
              {content.education.map((edu, index) => (
                <div
                  key={index}
                  className="bg-theme-alt p-6 rounded-theme-card border border-theme-main"
                >
                  <h3 className="text-lg font-semibold text-theme-primary mb-1">
                    {edu.degree}
                  </h3>
                  <p className="text-theme-secondary">{edu.school}</p>
                  <p className="text-sm text-theme-muted mt-2">{edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {content.certifications && content.certifications.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-theme-primary mb-6">
              Certifications
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {content.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="bg-theme-alt p-6 rounded-theme-card border border-theme-main"
                >
                  <h3 className="text-lg font-semibold text-theme-primary mb-1">
                    {cert.name}
                  </h3>
                  <p className="text-theme-secondary">{cert.issuer}</p>
                  <p className="text-sm text-theme-muted mt-2">{cert.year}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
