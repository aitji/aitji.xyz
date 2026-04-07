import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client, GatewayIntentBits } from 'discord.js'

const TOKEN = process.env.DISCORD_BOT_TOKEN!
const GUILD_ID = '1254409070925058071'
const USER_ID = '660742557009051659'

const TTL = 15 * 60 * 1000
type Cache = {
  status: string
  updated: number
}

let cache: Cache | null = null
async function fetchStatus(): Promise<string> {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences
    ]
  })

  await client.login(TOKEN)
  await new Promise(r => client.once('ready', r))

  const guild = await client.guilds.fetch(GUILD_ID)
  const member = await guild.members.fetch(USER_ID).catch(() => null)

  const status = member?.presence?.status ?? 'offline'

  await client.destroy()
  return status
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  if (cache && Date.now() - cache.updated < TTL) return res.json(cache)

  try {
    const status = await fetchStatus()
    cache = { status, updated: Date.now() }

    return res.json(cache)
  } catch { return res.status(500).json({ error: 'failed fetch discord status' }) }
}