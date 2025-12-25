import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { createPrestationSchema, validateData } from '@/lib/validations'

// GET - Liste toutes les prestations
export async function GET() {
  try {
    const prestations = await prisma.prestation.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(prestations)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des prestations' },
      { status: 500 }
    )
  }
}

// POST - Créer une prestation
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Valider les données
    const validation = validateData(createPrestationSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', errors: validation.errors },
        { status: 400 }
      )
    }

    const { title, description, price, benefits, order, published } = validation.data

    const prestation = await prisma.prestation.create({
      data: {
        title,
        description,
        price,
        benefits: JSON.stringify(benefits),
        order,
        published,
      },
    })

    return NextResponse.json(prestation, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création de la prestation' },
      { status: 500 }
    )
  }
}
