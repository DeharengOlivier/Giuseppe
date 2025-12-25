import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET - Récupérer tout le contenu des pages
export async function GET() {
  try {
    const content = await prisma.pageContent.findMany()
    
    // Convertir en objet clé-valeur
    const contentObj: Record<string, string> = {}
    for (const item of content) {
      contentObj[item.key] = item.value
    }

    return NextResponse.json(contentObj)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du contenu' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour le contenu d'une page
export async function PUT(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const updates = []

    for (const [key, value] of Object.entries(body)) {
      const update = prisma.pageContent.upsert({
        where: { key },
        update: { value: value as string },
        create: { key, value: value as string, type: 'text' },
      })
      updates.push(update)
    }

    await Promise.all(updates)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du contenu' },
      { status: 500 }
    )
  }
}
