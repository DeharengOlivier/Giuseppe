import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// POST - Activer un thème
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const { id } = await params

    // Désactiver tous les thèmes
    await prisma.theme.updateMany({
      data: { isActive: false }
    })

    // Activer le thème sélectionné
    const theme = await prisma.theme.update({
      where: { id },
      data: { isActive: true }
    })

    return NextResponse.json(theme)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de l\'activation du thème' },
      { status: 500 }
    )
  }
}
