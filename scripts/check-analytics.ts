import { loadEnvConfig } from '@next/env'

async function checkAnalytics() {
    loadEnvConfig(process.cwd())

    // Dynamic import to ensure env vars are loaded before the module evaluates
    const { default: clientPromise } = await import('../lib/mongodb')

    try {
        const client = await clientPromise
        const db = client.db('portfolio_analytics')
        const collection = db.collection('visits')

        const count = await collection.countDocuments()
        console.log(`Total visits: ${count}`)

        if (count > 0) {
            const visits = await collection.find({}).sort({ timestamp: -1 }).limit(10).toArray()
            console.log('Last 10 visits:', JSON.stringify(visits, null, 2))
        }

        process.exit(0)
    } catch (error) {
        console.error('Error:', error)
        process.exit(1)
    }
}

checkAnalytics()
