import { loadEnvConfig } from '@next/env'

async function clearAnalytics() {
    loadEnvConfig(process.cwd())

    const { default: clientPromise } = await import('../lib/mongodb')

    try {
        const client = await clientPromise
        const db = client.db('portfolio_analytics')
        const collection = db.collection('visits')

        const result = await collection.deleteMany({})
        console.log(`✅ Base de données nettoyée. ${result.deletedCount} visites supprimées.`)

        process.exit(0)
    } catch (error) {
        console.error('❌ Erreur:', error)
        process.exit(1)
    }
}

clearAnalytics()
