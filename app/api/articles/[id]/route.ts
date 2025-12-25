import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { updateArticleSchema, validateData } from '@/lib/validations'

// GET - Récupérer un article par son ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const session = await auth()

  try {
    const article = await prisma.article.findUnique({
      where: { id },
    })

    if (!article) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    // Si l'article n'est pas publié et qu'il n'y a pas de session, interdire l'accès
    if (!article.published && !session) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(article)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'article' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour un article
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

    // Valider les données
    const validation = validateData(updateArticleSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', errors: validation.errors },
        { status: 400 }
      )
    }

    const { title, content, excerpt, published } = validation.data

    // Récupérer l'article actuel pour vérifier son statut de publication
    const currentArticle = await prisma.article.findUnique({
      where: { id },
    })

    if (!currentArticle) {
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      )
    }

    // Déterminer la valeur de publishedAt :
    // - Si on passe de non publié à publié : nouvelle date
    // - Si déjà publié et reste publié : garder l'ancienne date
    // - Si on dépublie : null
    let publishedAt = currentArticle.publishedAt
    if (published && !currentArticle.published) {
      // Publication d'un article non publié
      publishedAt = new Date()
    } else if (!published) {
      // Dépublication
      publishedAt = null
    }
    // Sinon, on garde l'ancienne valeur (déjà publié et reste publié)

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        published,
        publishedAt,
      },
    })

    return NextResponse.json(article)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'article' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer un article
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
    await prisma.article.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'article' },
      { status: 500 }
    )
  }
}
