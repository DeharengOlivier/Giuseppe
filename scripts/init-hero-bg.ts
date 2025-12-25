import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const defaultValues = [
    { key: 'home_hero_bg_type', value: 'gradient' },
    { key: 'home_hero_bg_image', value: '' },
    { key: 'home_hero_bg_video', value: '' },
    { key: 'home_hero_overlay_opacity', value: '50' },
  ]

  for (const item of defaultValues) {
    await prisma.pageContent.upsert({
      where: { key: item.key },
      update: {},
      create: item,
    })
  }

  console.log('✅ Valeurs par défaut initialisées pour le fond du hero')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
