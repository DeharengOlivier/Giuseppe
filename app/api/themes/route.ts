import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET - Récupérer tous les thèmes
export async function GET() {
  try {
    const themes = await prisma.theme.findMany({
      orderBy: [
        { isActive: 'desc' },
        { isPredefined: 'desc' },
        { displayName: 'asc' }
      ]
    })

    return NextResponse.json(themes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des thèmes' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau thème
export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, displayName, config } = body

    // config est déjà une string JSON
    const theme = await prisma.theme.create({
      data: {
        name,
        displayName,
        config: config, // Ne pas re-stringify
        isPredefined: false,
        isActive: false
      }
    })

    return NextResponse.json(theme)
  } catch (error) {
    console.error('Error creating theme:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du thème' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un thème
export async function PUT(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, displayName, config } = body

    // config est déjà une string JSON
    const theme = await prisma.theme.update({
      where: { id },
      data: {
        displayName,
        config: config // Ne pas re-stringify
      }
    })

    return NextResponse.json(theme)
  } catch (error) {
    console.error('Error updating theme:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du thème' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un thème (seulement les non-prédéfinis)
export async function DELETE(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    // Lire l'ID depuis le body
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ error: 'ID manquant' }, { status: 400 })
    }

    // Vérifier que ce n'est pas un thème prédéfini
    const theme = await prisma.theme.findUnique({ where: { id } })
    
    if (!theme) {
      return NextResponse.json(
        { error: 'Thème introuvable' },
        { status: 404 }
      )
    }

    if (theme.isPredefined) {
      return NextResponse.json(
        { error: 'Impossible de supprimer un thème prédéfini' },
        { status: 403 }
      )
    }

    await prisma.theme.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting theme:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du thème' },
      { status: 500 }
    )
  }
}
