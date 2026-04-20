import { writeFileSync } from "node:fs"

const token = process.env.GH_TOKEN
const owner = "aitji"
const repo = "QoF"

interface GithubAsset {
  name: string
  browser_download_url: string
  size: number
}

interface GithubRelease {
  id: number
  tag_name: string
  name: string | null
  body: string | null
  prerelease: boolean
  draft: boolean
  published_at: string
  html_url: string
  assets: GithubAsset[]
}

export interface CleanRelease {
  id: number
  tag: string
  name: string
  version: string
  body: string
  prerelease: boolean
  publishedAt: string
  url: string
  downloadUrl: string | null
  downloadSize: number | null
}

async function fetchReleases(): Promise<void> {
  let all: GithubRelease[] = []
  let page = 1

  while (true) {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "aitji-xyz-action",
        },
      }
    )

    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)

    const batch: GithubRelease[] = await res.json()
    if (!batch.length) break
    all = all.concat(batch)
    if (batch.length < 100) break
    page++
  }

  const clean: CleanRelease[] = all
    .filter((r) => !r.draft)
    .map((r) => {
      const mcaddon = r.assets.find((a) => a.name.endsWith(".mcaddon"))
      return {
        id: r.id,
        tag: r.tag_name,
        name: r.name ?? r.tag_name,
        version: r.tag_name.replace(/^v/, ""),
        body: r.body ?? "",
        prerelease: r.prerelease,
        publishedAt: r.published_at,
        url: r.html_url,
        downloadUrl: mcaddon?.browser_download_url ?? null,
        downloadSize: mcaddon?.size ?? null,
      }
    })

  writeFileSync("releases.json", JSON.stringify(clean, null, 2))
  console.log(`wrote ${clean.length} releases to releases.json`)
}

fetchReleases().catch((err) => {
  console.error(err)
  process.exit(1)
})