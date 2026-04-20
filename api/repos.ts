import type { VercelRequest, VercelResponse } from '@vercel/node'

interface Repo {
    name: string;
    description: string;
    url: string;
    homepage: string;
    language: string;
    stars: number;
}

interface CacheData {
    repos: Repo[];
    timestamp: number;
}

const GITHUB_USER = 'aitji'
const CACHE_TTL = 60 * 60 * 1000
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USER}/repos`
let cachedRepos: CacheData | null = null

async function fetchFromGitHub(): Promise<Repo[]> {
    const headers: HeadersInit = {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'aitji-xyz',
        'Cache-Control': 'no-cache',
    }

    if (process.env.GITHUB_TOKEN) headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`
    const res = await fetch(GITHUB_API_URL, { headers })

    if (!res.ok) throw new Error(`GitHub API failed with status ${res.status}`)
    const data = await res.json()
    const repos: Repo[] = data
        .filter((repo: any) => !repo.fork && !repo.private)
        .map((repo: any) => ({
            name: repo.name,
            description: repo.description || '',
            url: repo.html_url,
            homepage: repo.homepage || '',
            language: repo.language || '',
            stars: repo.stargazers_count || 0,
        }))
        .sort((a: Repo, b: Repo) => b.stars - a.stars)

    return repos
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
    try {
        const now = Date.now()
        if (cachedRepos && now - cachedRepos.timestamp < CACHE_TTL)
            return res.status(200).json(cachedRepos.repos)

        const repos = await fetchFromGitHub()

        cachedRepos = {
            repos,
            timestamp: now,
        }

        res.setHeader('Cache-Control', 'public, max-age=3600')
        res.setHeader('Content-Type', 'application/json')

        return res.status(200).json(repos)
    } catch (error) {
        console.error('Error fetching repos:', error)
        return res.status(500).json({ error: 'Failed to fetch repositories' })
    }
}
