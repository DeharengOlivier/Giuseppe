import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const themes = [
  {
    name: 'minimal',
    displayName: 'Minimal (Défaut)',
    isActive: true,
    isPredefined: true,
    config: JSON.stringify({
      colors: {
        primary: { main: '#111827', hover: '#1f2937', light: '#6b7280' },
        secondary: { main: '#f9fafb', hover: '#f3f4f6' },
        background: { main: '#fafafa', alt: '#ffffff' },
        text: { primary: '#111827', secondary: '#6b7280', muted: '#9ca3af' },
        border: { main: '#e5e7eb', light: '#f3f4f6' }
      },
      typography: {
        fontFamily: {
          heading: 'var(--font-geist-sans)',
          body: 'var(--font-geist-sans)',
          mono: 'var(--font-geist-mono)'
        },
        fontSize: {
          h1: '3.75rem', h2: '3rem', h3: '2.25rem', h4: '1.875rem',
          body: '1rem', small: '0.875rem'
        },
        fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700' },
        lineHeight: { tight: '1.25', normal: '1.5', relaxed: '1.75' }
      },
      spacing: {
        section: { y: '4rem', x: '1.5rem' },
        card: { padding: '1.5rem', gap: '1rem' },
        container: { maxWidth: '80rem', padding: '1.5rem' }
      },
      borderRadius: {
        button: '9999px', card: '1rem', input: '0.5rem', image: '1rem'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      },
      animation: {
        duration: { fast: '150ms', normal: '300ms', slow: '500ms' },
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        hover: { scale: '1.05', translateY: '-2px' }
      }
    })
  },
  {
    name: 'corporate',
    displayName: 'Corporate',
    isActive: false,
    isPredefined: true,
    config: JSON.stringify({
      colors: {
        primary: { main: '#1e40af', hover: '#1e3a8a', light: '#3b82f6' },
        secondary: { main: '#0ea5e9', hover: '#0284c7' },
        background: { main: '#ffffff', alt: '#f8fafc' },
        text: { primary: '#0f172a', secondary: '#475569', muted: '#94a3b8' },
        border: { main: '#cbd5e1', light: '#e2e8f0' }
      },
      typography: {
        fontFamily: {
          heading: 'system-ui, -apple-system, sans-serif',
          body: 'system-ui, -apple-system, sans-serif',
          mono: 'ui-monospace, monospace'
        },
        fontSize: {
          h1: '4rem', h2: '3.5rem', h3: '2.5rem', h4: '2rem',
          body: '1.125rem', small: '1rem'
        },
        fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700' },
        lineHeight: { tight: '1.2', normal: '1.6', relaxed: '1.8' }
      },
      spacing: {
        section: { y: '5rem', x: '2rem' },
        card: { padding: '2rem', gap: '1.5rem' },
        container: { maxWidth: '75rem', padding: '2rem' }
      },
      borderRadius: {
        button: '0.375rem', card: '0.5rem', input: '0.375rem', image: '0.5rem'
      },
      shadows: {
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        md: '0 4px 8px -2px rgba(0, 0, 0, 0.15)',
        lg: '0 12px 20px -5px rgba(0, 0, 0, 0.2)',
        xl: '0 24px 32px -8px rgba(0, 0, 0, 0.25)'
      },
      animation: {
        duration: { fast: '200ms', normal: '400ms', slow: '600ms' },
        easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        hover: { scale: '1.02', translateY: '-1px' }
      }
    })
  },
  {
    name: 'creative',
    displayName: 'Creative',
    isActive: false,
    isPredefined: true,
    config: JSON.stringify({
      colors: {
        primary: { main: '#ec4899', hover: '#db2777', light: '#f472b6' },
        secondary: { main: '#8b5cf6', hover: '#7c3aed' },
        background: { main: '#fef2f2', alt: '#ffffff' },
        text: { primary: '#1f2937', secondary: '#6b7280', muted: '#9ca3af' },
        border: { main: '#fecdd3', light: '#fee2e2' }
      },
      typography: {
        fontFamily: {
          heading: 'var(--font-geist-sans)',
          body: 'var(--font-geist-sans)',
          mono: 'var(--font-geist-mono)'
        },
        fontSize: {
          h1: '4.5rem', h2: '3.75rem', h3: '3rem', h4: '2.25rem',
          body: '1.125rem', small: '0.938rem'
        },
        fontWeight: { normal: '400', medium: '500', semibold: '700', bold: '800' },
        lineHeight: { tight: '1.1', normal: '1.6', relaxed: '1.9' }
      },
      spacing: {
        section: { y: '6rem', x: '2rem' },
        card: { padding: '2.5rem', gap: '2rem' },
        container: { maxWidth: '85rem', padding: '2rem' }
      },
      borderRadius: {
        button: '2rem', card: '1.5rem', input: '1rem', image: '1.5rem'
      },
      shadows: {
        sm: '0 2px 4px 0 rgba(236, 72, 153, 0.1)',
        md: '0 8px 16px -2px rgba(236, 72, 153, 0.2)',
        lg: '0 16px 32px -4px rgba(236, 72, 153, 0.25)',
        xl: '0 32px 48px -8px rgba(236, 72, 153, 0.3)'
      },
      animation: {
        duration: { fast: '200ms', normal: '400ms', slow: '700ms' },
        easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        hover: { scale: '1.08', translateY: '-4px' }
      }
    })
  },
  {
    name: 'dark',
    displayName: 'Dark Mode',
    isActive: false,
    isPredefined: true,
    config: JSON.stringify({
      colors: {
        primary: { main: '#60a5fa', hover: '#3b82f6', light: '#93c5fd' },
        secondary: { main: '#a78bfa', hover: '#8b5cf6' },
        background: { main: '#0f172a', alt: '#1e293b' },
        text: { primary: '#f1f5f9', secondary: '#cbd5e1', muted: '#94a3b8' },
        border: { main: '#334155', light: '#475569' }
      },
      typography: {
        fontFamily: {
          heading: 'var(--font-geist-sans)',
          body: 'var(--font-geist-sans)',
          mono: 'var(--font-geist-mono)'
        },
        fontSize: {
          h1: '4rem', h2: '3.5rem', h3: '2.75rem', h4: '2rem',
          body: '1.125rem', small: '1rem'
        },
        fontWeight: { normal: '300', medium: '400', semibold: '600', bold: '700' },
        lineHeight: { tight: '1.2', normal: '1.7', relaxed: '1.9' }
      },
      spacing: {
        section: { y: '5rem', x: '1.5rem' },
        card: { padding: '2rem', gap: '1.5rem' },
        container: { maxWidth: '80rem', padding: '1.5rem' }
      },
      borderRadius: {
        button: '0.75rem', card: '1rem', input: '0.75rem', image: '1rem'
      },
      shadows: {
        sm: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
        md: '0 6px 12px -2px rgba(0, 0, 0, 0.6)',
        lg: '0 12px 24px -4px rgba(0, 0, 0, 0.7)',
        xl: '0 24px 40px -8px rgba(0, 0, 0, 0.8)'
      },
      animation: {
        duration: { fast: '200ms', normal: '350ms', slow: '550ms' },
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        hover: { scale: '1.05', translateY: '-2px' }
      }
    })
  },
  {
    name: 'tech',
    displayName: 'Tech',
    isActive: false,
    isPredefined: true,
    config: JSON.stringify({
      colors: {
        primary: { main: '#06b6d4', hover: '#0891b2', light: '#22d3ee' },
        secondary: { main: '#a855f7', hover: '#9333ea' },
        background: { main: '#ffffff', alt: '#f0fdfa' },
        text: { primary: '#134e4a', secondary: '#115e59', muted: '#5eead4' },
        border: { main: '#99f6e4', light: '#ccfbf1' }
      },
      typography: {
        fontFamily: {
          heading: 'var(--font-geist-mono)',
          body: 'var(--font-geist-sans)',
          mono: 'var(--font-geist-mono)'
        },
        fontSize: {
          h1: '3.5rem', h2: '2.875rem', h3: '2.25rem', h4: '1.75rem',
          body: '1rem', small: '0.875rem'
        },
        fontWeight: { normal: '400', medium: '500', semibold: '600', bold: '700' },
        lineHeight: { tight: '1.3', normal: '1.6', relaxed: '1.8' }
      },
      spacing: {
        section: { y: '4.5rem', x: '1.5rem' },
        card: { padding: '1.75rem', gap: '1.25rem' },
        container: { maxWidth: '82rem', padding: '1.5rem' }
      },
      borderRadius: {
        button: '0.25rem', card: '0.5rem', input: '0.25rem', image: '0.5rem'
      },
      shadows: {
        sm: '0 1px 3px 0 rgba(6, 182, 212, 0.2)',
        md: '0 4px 8px -1px rgba(6, 182, 212, 0.25)',
        lg: '0 10px 20px -2px rgba(6, 182, 212, 0.3)',
        xl: '0 20px 30px -4px rgba(6, 182, 212, 0.35)'
      },
      animation: {
        duration: { fast: '100ms', normal: '250ms', slow: '450ms' },
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        hover: { scale: '1.03', translateY: '-1px' }
      }
    })
  }
]

async function main() {
  console.log('🎨 Initialisation des thèmes prédéfinis...')

  for (const theme of themes) {
    await prisma.theme.upsert({
      where: { name: theme.name },
      update: {},
      create: theme,
    })
    console.log(`✅ Thème "${theme.displayName}" créé`)
  }

  console.log('\n✨ Tous les thèmes ont été initialisés avec succès!')
}

main()
  .catch((e) => {
    console.error('❌ Erreur:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
