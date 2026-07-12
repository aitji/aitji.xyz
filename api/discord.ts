import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client, GatewayIntentBits } from 'discord.js'

const TOKEN = process.env.DISCORD_BOT_TOKEN!
const GUILD_ID = '1254409070925058071'
const USER_ID = '660742557009051659'
const LANYARD_URL = `https://api.lanyard.rest/v1/users/${USER_ID}`

const TTL = 60 * 1000
const TIMEOUT = 8 * 1000

type Status = 'online' | 'idle' | 'dnd' | 'offline'
type Cache = { status: Status; updated: number }
let cache: Cache | null = null

let client: Client | null = null
let clientReady = false

function isStatus(value: unknown): value is Status {
  return value === 'online' || value === 'idle' || value === 'dnd' || value === 'offline'
}

async function fetchFromLanyard(): Promise<Status> {
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), TIMEOUT)

  try {
    const res = await fetch(LANYARD_URL, { signal: controller.signal })

    if (res.status === 429) throw new Error('lanyard rate limited')
    if (!res.ok) throw new Error(`lanyard http ${res.status}`)

    const json = await res.json()
    if (!json?.success) throw new Error('lanyard unsuccessful')

    const status = json?.data?.discord_status
    if (!isStatus(status)) throw new Error('lanyard bad payload')

    return status
  } finally {
    clearTimeout(t)
  }
}

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

async function fetchFromDiscord(): Promise<Status> {
  const c = await getClient()

  const guild = await c.guilds.fetch(GUILD_ID)
  const member = await guild.members.fetch({ user: USER_ID, force: true }).catch(() => null)

  const status = member?.presence?.status
  return isStatus(status) ? status : 'offline'
}

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${label} timeout`)), TIMEOUT)
    ),
  ])
}

async function fetchStatus(): Promise<Status> {
  try { return await fetchFromLanyard() }
  catch { return await withTimeout(fetchFromDiscord(), 'discord') }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end()
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')

  if (cache && Date.now() - cache.updated < TTL) {
    return res.json({ status: cache.status, cached: true })
  }

  try {
    const status = await fetchStatus()

    cache = { status, updated: Date.now() }
    return res.json({ status, cached: false })

  } catch (err) {
    clientReady = false
    client = null

    if (cache) return res.json({ status: cache.status, cached: true, stale: true })
    return res.status(500).json({ error: 'failed to fetch discord status' })
  }
}