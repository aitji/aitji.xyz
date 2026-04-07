import { createResource, For, Show } from "solid-js";

interface Repo {
  name: string;
  description: string;
  url: string;
  homepage: string;
  language: string;
  stars: number;
}

const LANG_COLOR: Record<string, string> = Object.freeze({
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  HTML: "#e34c26",
  Astro: "#ff5a03",
  CSS: "#563d7c",
  Python: "#3572a5",
  PHP: "#777bb4",
  PowerShell: "#2a6db1",
});

const DATA_URL =
  "https://raw.githubusercontent.com/aitji/aitji.xyz/refs/heads/data/repos.json";

async function fetchRepos(): Promise<Repo[]> {
  const res = await fetch(DATA_URL);
  if (!res.ok) throw new Error("fetch failed -.-;;");
  return res.json();
}

export default function Projects() {
  const [repos] = createResource(fetchRepos);

  return (
    <div class="projects-grid">
      <Show
        when={!repos.loading}
        fallback={<p class="projects-placeholder">loading projects...</p>}
      >
        <Show
          when={!repos.error}
          fallback={<p class="projects-placeholder">couldn't load repos :(</p>}
        >
          <For each={repos()}>
            {(repo) => (
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                class="project-card"
              >
                <div class="project-top">
                  <span class="project-name">{repo.name}</span>
                  {repo.stars > 0 && (
                    <span class="project-stars">★ {repo.stars}</span>
                  )}
                </div>
                {repo.description && (
                  <p class="project-desc">{repo.description}</p>
                )}
                <div class="project-bottom">
                  {repo.language && (
                    <span class="project-lang">
                      <span
                        class="lang-dot"
                        style={{
                          background: LANG_COLOR[repo.language] ?? "#9b8890",
                        }}
                      />
                      {repo.language}
                    </span>
                  )}
                  {repo.homepage && <span class="project-live">↗ live</span>}
                </div>
              </a>
            )}
          </For>
        </Show>
      </Show>
    </div>
  );
}
