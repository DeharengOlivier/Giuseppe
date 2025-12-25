import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { createExperienceSchema, validateData } from '@/lib/validations'

// GET - Liste toutes les expériences
export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(experiences)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des expériences' },
      { status: 500 }
    )
  }
}

// POST - Créer une expérience
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Valider les données
    const validation = validateData(createExperienceSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', errors: validation.errors },
        { status: 400 }
      )
    }

    const { position, company, location, startDate, endDate, current, description, skills, order } = validation.data

    const experience = await prisma.experience.create({
      data: {
        position,
        company,
        location,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        current,
        description,
        skills: JSON.stringify(skills),
        order,
      },
    })

    return NextResponse.json(experience, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'expérience' },
      { status: 500 }
    )
  }
}
