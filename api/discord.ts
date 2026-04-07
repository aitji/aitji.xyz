import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client, GatewayIntentBits } from 'discord.js'

const TOKEN = process.env.DISCORD_BOT_TOKEN!
const GUILD_ID = '1254409070925058071'
const USER_ID = '660742557009051659'

const TTL = 60 * 1000
const TIMEOUT = 8 * 1000

type Cache = { status: string; updated: number }
let cache: Cache | null = null

let client: Client | null = null
let clientReady = false

async function getClient(): Promise<Client> {
  if (client && clientReady) return client

  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
    ],
  })

  await client.login(TOKEN)
  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('login timeout')), TIMEOUT)
    client!.once('ready', () => { clearTimeout(t); resolve() })
    client!.once('error', reject)
  })

  client.on('error', () => { clientReady = false; client = null })
  client.on('shardDisconnect', () => { clientReady = false; client = null })

  clientReady = true
  return client
}

async function fetchStatus(): Promise<string> {
  const c = await getClient()

  const guild = await c.guilds.fetch(GUILD_ID)
  const member = await guild.members.fetch({ user: USER_ID, force: true }).catch(() => null)

  return member?.presence?.status ?? 'offline'
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  if (cache && Date.now() - cache.updated < TTL) return res.json({ ...cache, cached: true })

  try {
    const status = await Promise.race([
      fetchStatus(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), TIMEOUT)
      ),
    ])

    cache = { status, updated: Date.now() }
    return res.json({ ...cache, cached: false })

  } catch (err) {
    clientReady = false
    client = null

    if (cache) return res.json({ ...cache, cached: true, stale: true })
    return res.status(500).json({ error: 'failed to fetch discord status' })
  }
}