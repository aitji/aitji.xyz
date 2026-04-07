import type { VercelRequest, VercelResponse } from '@vercel/node'

let cachedStatus: string = 'offline'
let lastUpdated: number = 0
const VALID = new Set(['online', 'idle', 'dnd', 'offline'])

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60')
    return res.status(200).json({ status: cachedStatus, updated: lastUpdated })
  }

  if (req.method === 'POST') {
    const secret = process.env.DISCORD_BOT_SECRET
    const { status, key } = req.body ?? {}

    if (!secret || key !== secret) return res.status(401).json({ error: 'unauthorized' })
    if (!VALID.has(status)) return res.status(400).json({ error: 'invalid status' })

    cachedStatus = status
    lastUpdated  = Date.now()
    return res.status(200).json({ ok: true, status })
  }

  return res.status(405).json({ error: 'method not allowed' })
}