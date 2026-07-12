import { writeFileSync } from "node:fs"

const token = process.env.GH_TOKEN
const username = "aitji"

interface GithubRepo {
  name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  updated_at: string
  fork: boolean
  private: boolean
}

interface CleanRepo {
  name: string
  description: string
  url: string
  homepage: string
  language: string
  stars: number
  updated: string
}

async function fetchRepos(): Promise<void> {
  const repos: GithubRepo[] = []

  for (let page = 1; ; page++) {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&type=owner&per_page=100&page=${page}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    )

    if (!res.ok) throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)

    const data: GithubRepo[] = await res.json()
    repos.push(...data)

    if (data.length < 100) break
  }

  const clean: CleanRepo[] = repos
    .filter(r => !r.fork && !r.private)
    .map((r) => ({
      name: r.name,
      description: r.description ?? "",
      url: r.html_url,
      homepage: r.homepage ?? "",
      language: r.language ?? "",
      stars: r.stargazers_count,
      updated: r.updated_at
    }))

  writeFileSync("repos.json", JSON.stringify(clean, null, 2))
  console.log(`wrote ${clean.length} repos to repos.json`)
}

fetchRepos().catch((err) => {
  console.error(err)
  process.exit(1)
})