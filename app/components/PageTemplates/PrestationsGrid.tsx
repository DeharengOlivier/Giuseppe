'use client'

import { Check, ArrowRight } from 'lucide-react'

interface Prestation {
  id: string
  title: string
  description: string
  price: string | null
  benefits: string[]
  featured: boolean
}

interface PrestationsGridProps {
  title: string
  intro?: string
  prestations: Prestation[]
}

export function PrestationsGrid({ title, intro, prestations }: PrestationsGridProps) {
  return (
    <div className="min-h-screen bg-theme-main pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre centré */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-primary mb-4">
            {title}
          </h1>
          {intro && (
            <p className="text-xl text-theme-secondary mt-6 max-w-3xl mx-auto">
              {intro}
            </p>
          )}
          <div className="w-20 h-1 bg-theme-primary mx-auto rounded-full mt-6"></div>
        </div>

        {/* Grille de prestations */}
        {prestations.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prestations.map((prestation) => (
              <div
                key={prestation.id}
                className={`relative bg-theme-alt rounded-theme-card border transition-theme hover-scale-theme ${prestation.featured
                    ? 'border-theme-primary shadow-theme-xl'
                    : 'border-theme-main shadow-theme-md hover:shadow-theme-lg'
                  }`}
              >
                {/* Badge "Recommandé" pour prestations featured */}
                {prestation.featured && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-theme-primary text-theme-inverted text-sm font-semibold rounded-full shadow-theme-md">
                      Recommandé
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* En-tête */}
                  <h3 className="text-2xl font-bold text-theme-primary mb-3">
                    {prestation.title}
                  </h3>

                  <p className="text-theme-secondary mb-6 leading-relaxed">
                    {prestation.description}
                  </p>

                  {/* Prix */}
                  {prestation.price && (
                    <div className="mb-6 pb-6 border-b border-theme-border">
                      <p className="text-3xl font-bold text-theme-primary">
                        {prestation.price}
                      </p>
                    </div>
                  )}

                  {/* Liste des bénéfices */}
                  {prestation.benefits && prestation.benefits.length > 0 && (
                    <ul className="space-y-3 mb-8">
                      {prestation.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="mt-1 flex-shrink-0">
                            <div className="w-5 h-5 rounded-full bg-theme-primary/10 flex items-center justify-center">
                              <Check className="w-3 h-3 text-theme-primary" />
                            </div>
                          </div>
                          <span className="text-theme-secondary">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Bouton CTA */}
                  <button
                    className={`w-full py-3 px-6 rounded-theme-button font-medium transition-theme flex items-center justify-center gap-2 group ${prestation.featured
                        ? 'bg-theme-primary text-theme-inverted hover:bg-theme-primary-hover'
                        : 'bg-theme-main border border-theme-main text-theme-primary hover:border-theme-primary'
                      }`}
                  >
                    <span>En savoir plus</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-theme-muted">
            Aucune prestation à afficher pour le moment
          </div>
        )}

        {/* Section CTA */}
        <div className="mt-20 text-center bg-theme-alt rounded-theme-card border border-theme-main p-12">
          <h2 className="text-2xl font-bold text-theme-primary mb-4">
            Besoin d'un service personnalisé ?
          </h2>
          <p className="text-theme-secondary mb-6 max-w-2xl mx-auto">
            Chaque projet est unique. Contactez-moi pour discuter de vos besoins spécifiques
            et obtenir un devis sur mesure.
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-theme-primary text-theme-inverted rounded-theme-button font-medium hover:bg-theme-primary-hover transition-theme shadow-theme-lg hover-scale-theme gap-2">
            <span>Demander un devis</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
