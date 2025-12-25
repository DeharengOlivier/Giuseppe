import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db('portfolio_analytics')
    const collection = db.collection('visits')

    // Statistiques par pays
    const byCountry = await collection.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray()

    // Statistiques par page
    const byPage = await collection.aggregate([
      {
        $group: {
          _id: '$page',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]).toArray()

    // Visites des dernières 24h
    const last24h = await collection.countDocuments({
      timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    })

    // Visites des 7 derniers jours
    const last7days = await collection.countDocuments({
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })

    // Visites par jour (7 derniers jours)
    const byDay = await collection.aggregate([
      {
        $match: {
          timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray()

    // Total de visites
    const total = await collection.countDocuments()

    return NextResponse.json({
      byCountry,
      byPage,
      last24h,
      last7days,
      byDay,
      total
    }, { status: 200 })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
