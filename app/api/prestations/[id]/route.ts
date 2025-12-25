import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET - Récupérer une prestation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const prestation = await prisma.prestation.findUnique({
      where: { id },
    })

    if (!prestation) {
      return NextResponse.json(
        { error: 'Prestation non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(prestation)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la prestation' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une prestation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await request.json()
    const { title, description, price, benefits, order, published } = body

    const prestation = await prisma.prestation.update({
      where: { id },
      data: {
        title,
        description,
        price,
        benefits: JSON.stringify(benefits || []),
        order,
        published,
      },
    })

    return NextResponse.json(prestation)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la prestation' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une prestation
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.prestation.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la prestation' },
      { status: 500 }
    )
  }
}
