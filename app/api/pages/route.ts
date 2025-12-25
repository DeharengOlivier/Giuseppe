import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

// GET - Récupérer toutes les pages (publiques ou toutes pour admin)
export async function GET(request: NextRequest) {
  const session = await auth()
  const { searchParams } = new URL(request.url)
  const publicOnly = searchParams.get('public') === 'true'

  try {
    const where = publicOnly ? { published: true } : {}
    
    const pages = await prisma.page.findMany({
      where,
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(pages)
  } catch (error) {
    console.error('Error fetching pages:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des pages' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle page
export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, slug, type, content, published, showInNav, showInFooter, icon, centered } = body

    // Vérifier si le slug existe déjà
    const existing = await prisma.page.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: 'Ce slug existe déjà' },
        { status: 400 }
      )
    }

    // Obtenir le prochain ordre
    const lastPage = await prisma.page.findFirst({
      orderBy: { order: 'desc' }
    })
    const nextOrder = (lastPage?.order ?? -1) + 1

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        type,
        content,
        published: published ?? false,
        showInNav: showInNav ?? true,
        showInFooter: showInFooter ?? false,
        icon: icon ?? null,
        order: nextOrder,
        centered: centered ?? true
      }
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error creating page:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la page' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour une page
export async function PUT(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, title, slug, type, content, published, showInNav, showInFooter, icon, order, centered } = body

    // Si le slug change, vérifier qu'il n'existe pas déjà
    if (slug) {
      const existing = await prisma.page.findFirst({
        where: {
          slug,
          NOT: { id }
        }
      })
      if (existing) {
        return NextResponse.json(
          { error: 'Ce slug existe déjà' },
          { status: 400 }
        )
      }
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(type !== undefined && { type }),
        ...(content !== undefined && { content }),
        ...(published !== undefined && { published }),
        ...(showInNav !== undefined && { showInNav }),
        ...(showInFooter !== undefined && { showInFooter }),
        ...(icon !== undefined && { icon }),
        ...(order !== undefined && { order }),
        ...(centered !== undefined && { centered })
      }
    })

    return NextResponse.json(page)
  } catch (error) {
    console.error('Error updating page:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la page' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une page
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

    // Vérifier si c'est une page prédéfinie (protégée contre la suppression)
    const page = await prisma.page.findUnique({ where: { id } })
    
    if (!page) {
      return NextResponse.json({ error: 'Page introuvable' }, { status: 404 })
    }

    const protectedTypes = ['prestations', 'experiences', 'about', 'activities', 'courses']
    if (protectedTypes.includes(page.type)) {
      return NextResponse.json(
        { error: 'Cette page système ne peut pas être supprimée. Vous pouvez seulement la dépublier.' },
        { status: 403 }
      )
    }

    await prisma.page.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting page:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la page' },
      { status: 500 }
    )
  }
}
