import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Récupérer le thème actif
export async function GET() {
  try {
    const theme = await prisma.theme.findFirst({
      where: { isActive: true }
    })

    if (!theme) {
      return NextResponse.json(
        { error: 'Aucun thème actif trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(theme)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du thème actif' },
      { status: 500 }
    )
  }
}
