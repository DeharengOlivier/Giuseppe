import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎨 Initializing default theme...')

  // Design tokens par défaut
  const defaultThemeConfig = {
    colors: {
      primary: '#4F46E5', // Indigo 600
      secondary: '#4B5563', // Gray 600
      background: {
        main: '#FFFFFF',
        alt: '#F9FAFB',
      },
      text: {
        main: '#111827',
        muted: '#6B7280',
        inverted: '#FFFFFF'
      }
    },
    borderRadius: '0.5rem',
    fonts: {
      heading: 'Inter',
      body: 'Inter'
    }
  }

  try {
    const theme = await prisma.theme.upsert({
      where: { name: 'default' },
      update: {
        isActive: true,
        displayName: 'Thème Standard',
        config: JSON.stringify(defaultThemeConfig)
      },
      create: {
        name: 'default',
        displayName: 'Thème Standard',
        isActive: true,
        isPredefined: true,
        config: JSON.stringify(defaultThemeConfig)
      }
    })

    console.log('✅ Default theme initialized:', theme.name)
  } catch (error) {
    console.error('❌ Error initializing theme:', error)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
