import type { VercelRequest, VercelResponse } from '@vercel/node'

interface CacheData {
    repos: unknown[]
    timestamp: number
}

const RAW_URL = "https://raw.githubusercontent.com/aitji/aitji.xyz/refs/heads/data/repos.json"
const CACHE_TTL = 60 * 60 * 1000
let cache: CacheData | null = null

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

    try {
        const now = Date.now()

        if (cache && now - cache.timestamp < CACHE_TTL)
            return res.status(200).json(cache.repos)

        const headers: HeadersInit = {
            "User-Agent": "aitji-xyz",
            "Cache-Control": "no-cache",
        }

        if (process.env.GITHUB_TOKEN)
            headers["Authorization"] = `token ${process.env.GITHUB_TOKEN}`

        const r = await fetch(RAW_URL, { headers })

        if (!r.ok) throw new Error(`Upstream fetch failed: ${r.status}`)

        const repos: unknown[] = await r.json()
        cache = { repos, timestamp: now }

        res.setHeader('Cache-Control', 'public, max-age=3600')
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Access-Control-Allow-Origin', '*')

        return res.status(200).json(repos)
    } catch (error) {
        console.error('repos error:', error)
        if (cache) return res.status(200).json(cache.repos)

        return res.status(500).json({ error: 'Failed to fetch repositories' })
    }
}
