import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { createArticleSchema, validateData } from '@/lib/validations'

// GET - Liste tous les articles (publics) ou tous si authentifié
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const published = searchParams.get('published')
  const session = await auth()

  try {
    const where = session ? {} : { published: true }
    
    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
    })

    return NextResponse.json(articles)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des articles' },
      { status: 500 }
    )
  }
}

// POST - Créer un article (authentification requise)
export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Valider les données
    const validation = validateData(createArticleSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Données invalides', errors: validation.errors },
        { status: 400 }
      )
    }

    const { title, content, excerpt, published } = validation.data

    // Générer un slug à partir du titre
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        published,
        publishedAt: published ? new Date() : null,
      },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'article' },
      { status: 500 }
    )
  }
}
