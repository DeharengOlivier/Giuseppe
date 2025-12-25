import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET - Récupérer une expérience
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const experience = await prisma.experience.findUnique({
      where: { id },
    })

    if (!experience) {
      return NextResponse.json(
        { error: 'Expérience non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json(experience)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'expérience' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une expérience
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
    const { position, company, location, startDate, endDate, current, description, skills, order } = body

    const experience = await prisma.experience.update({
      where: { id },
      data: {
        position,
        company,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current,
        description,
        skills: JSON.stringify(skills || []),
        order,
      },
    })

    return NextResponse.json(experience)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'expérience' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une expérience
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
    await prisma.experience.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'expérience' },
      { status: 500 }
    )
  }
}
