import type { VercelRequest, VercelResponse } from '@vercel/node'
export default (_req: VercelRequest, res: VercelResponse) => res.json({ pong: true, timestamp: Date.now() })
