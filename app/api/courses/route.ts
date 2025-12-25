import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET - Liste tous les cours
export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: [
        { type: 'asc' }, // university avant professional
        { order: 'asc' }
      ]
    })
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des cours' },
      { status: 500 }
    )
  }
}

// POST - Créer un cours
export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, institution, type, level, period, duration, description, published } = body

    // Obtenir le prochain ordre
    const lastCourse = await prisma.course.findFirst({
      where: { type },
      orderBy: { order: 'desc' }
    })
    const nextOrder = (lastCourse?.order ?? -1) + 1

    const course = await prisma.course.create({
      data: {
        title,
        institution,
        type,
        level: level || null,
        period: period || null,
        duration: duration || null,
        description: description || null,
        published: published ?? true,
        order: nextOrder
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du cours' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un cours
export async function PUT(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, title, institution, type, level, period, duration, description, published, order } = body

    const course = await prisma.course.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(institution !== undefined && { institution }),
        ...(type !== undefined && { type }),
        ...(level !== undefined && { level }),
        ...(period !== undefined && { period }),
        ...(duration !== undefined && { duration }),
        ...(description !== undefined && { description }),
        ...(published !== undefined && { published }),
        ...(order !== undefined && { order })
      }
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du cours' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un cours
export async function DELETE(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    await prisma.course.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du cours' },
      { status: 500 }
    )
  }
}
