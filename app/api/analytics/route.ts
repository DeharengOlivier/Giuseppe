import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

// Fonction pour géolocaliser une IP avec ip-api.com (gratuit, 45 req/min)
async function geolocateIP(ip: string) {
  // Ne pas géolocaliser les IPs locales
  if (ip === 'unknown' || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return null
  }

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,region,regionName,city,lat,lon,timezone`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    })
    
    if (!response.ok) {
      console.log('⚠️ Geolocation API error:', response.status)
      return null
    }
    
    const data = await response.json()
    
    if (data.status === 'success') {
      return {
        country: data.countryCode || 'unknown',
        city: data.city || 'unknown',
        region: data.regionName || 'unknown',
        timezone: data.timezone || 'unknown',
        ll: [data.lat || 0, data.lon || 0]
      }
    }
    
    return null
  } catch (error) {
    console.error('⚠️ Geolocation error:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📊 Analytics POST: Request received')
    
    const body = await request.json()
    const { page } = body
    
    console.log('📊 Analytics POST: Page:', page)

    // Récupérer l'IP du visiteur
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'
    
    console.log('📊 Analytics POST: IP:', ip)
    
    // Géolocaliser l'IP
    const geo = await geolocateIP(ip)
    console.log('📊 Analytics POST: Geo:', geo)
    
    // Récupérer le user agent
    const userAgent = request.headers.get('user-agent') || 'unknown'
    
    // Récupérer le referer
    const referer = request.headers.get('referer') || 'direct'

    // Enregistrer dans MongoDB
    console.log('📊 Analytics POST: Connecting to MongoDB...')
    const client = await clientPromise
    const db = client.db('portfolio_analytics')
    const collection = db.collection('visits')

    const visit = {
      ip,
      page,
      country: geo?.country || 'unknown',
      city: geo?.city || 'unknown',
      region: geo?.region || 'unknown',
      timezone: geo?.timezone || 'unknown',
      ll: geo?.ll || [0, 0],
      userAgent,
      referer,
      timestamp: new Date(),
    }

    console.log('📊 Analytics POST: Inserting visit:', visit)
    const result = await collection.insertOne(visit)
    console.log('📊 Analytics POST: Insert result:', result)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('❌ Analytics POST: Error tracking visit:', error)
    return NextResponse.json({ error: 'Failed to track visit' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const country = searchParams.get('country')
    const limit = parseInt(searchParams.get('limit') || '100')
    const skip = parseInt(searchParams.get('skip') || '0')

    const client = await clientPromise
    const db = client.db('portfolio_analytics')
    const collection = db.collection('visits')

    // Construire le filtre
    const filter: any = {}
    if (page) filter.page = page
    if (country) filter.country = country

    // Récupérer les visites
    const visits = await collection
      .find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    // Compter le total
    const total = await collection.countDocuments(filter)

    return NextResponse.json({ visits, total }, { status: 200 })
  } catch (error) {
    console.error('Error fetching visits:', error)
    return NextResponse.json({ error: 'Failed to fetch visits' }, { status: 500 })
  }
}
