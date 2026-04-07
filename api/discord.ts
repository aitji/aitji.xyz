import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Client, GatewayIntentBits } from 'discord.js'

const TOKEN = process.env.DISCORD_BOT_TOKEN!
const GUILD_ID = '1254409070925058071'
const USER_ID = '660742557009051659'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  console.log('[1] handler start')
  console.log('[1] TOKEN exists:', !!TOKEN)
  console.log('[1] TOKEN length:', TOKEN?.length)

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
    ],
  })

  console.log('[2] client created, logging in...')
  await client.login(TOKEN)
  console.log('[3] login() resolved')

  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('ready timeout after 8s')), 8000)
    client.once('ready', (_readyClient) => {
      clearTimeout(t)
      console.log('[4] client ready, user:', client.user?.tag)
      resolve()
    })
    client.once('error', (err) => {
      clearTimeout(t)
      console.log('[4] client error:', err)
      reject(err)
    })
  })

  console.log('[5] fetching guild', GUILD_ID)
  const guild = await client.guilds.fetch(GUILD_ID)
  console.log('[6] guild fetched:', guild.name)

  console.log('[7] fetching member', USER_ID)
  const member = await guild.members.fetch({ user: USER_ID, force: true })
  console.log('[8] member fetched:', member?.user?.tag)
  console.log('[8] presence:', member?.presence?.status)
  console.log('[8] presence full:', JSON.stringify(member?.presence?.toJSON?.() ?? member?.presence))

  await client.destroy()
  console.log('[9] client destroyed')

  return res.json({
    status: member?.presence?.status ?? 'offline',
    updated: Date.now(),
  })
}