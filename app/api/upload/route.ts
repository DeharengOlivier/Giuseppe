import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { auth } from '@/auth'

export async function POST(request: NextRequest) {
  const session = await auth()
  
  if (!session) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/webm']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Type de fichier non autorisé. Utilisez JPG, PNG, WebP, GIF, MP4 ou WebM' 
      }, { status: 400 })
    }

    // Vérifier la taille (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({
        error: 'Fichier trop volumineux. Maximum 10MB'
      }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Créer le dossier uploads s'il n'existe pas
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Le dossier existe déjà
    }

    // Générer un nom de fichier unique
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `${timestamp}-${originalName}`
    const filepath = join(uploadsDir, filename)

    // Sauvegarder le fichier
    await writeFile(filepath, buffer)

    // Retourner l'URL publique
    const publicUrl = `/uploads/${filename}`

    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      filename,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'upload du fichier' },
      { status: 500 }
    )
  }
}
