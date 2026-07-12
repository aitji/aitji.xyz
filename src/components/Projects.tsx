import { createSignal, onMount, For, Show } from "solid-js";

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

const INITIAL_SHOW = 6;

async function fetchRepos(): Promise<Repo[]> {
  try {
    const r = await fetch("https://cdn.jsdelivr.net/gh/aitji/aitji.xyz@data/repos.json");
    if (r.ok) return r.json();
  } catch (e) {
    console.warn("JSDelivr fetch failed, trying backend:", e);
  }

  try {
    const r = await fetch("/api/repos");
    if (r.ok) return r.json();
  } catch (e) {
    console.warn("Backend fetch also failed:", e);
  }

  throw new Error("fetch failed -.-;;");
}

function SkeletonCard() {
  return (
    <div class="project-card skeleton-card">
      <div class="project-top">
        <div class="skeleton-title"></div>
        <div class="skeleton-stars"></div>
      </div>
      <div class="skeleton-desc"></div>
      <div class="project-bottom">
        <div class="skeleton-lang"></div>
      </div>
    </div>
  );
}

function ProjectCard(props: { repo: Repo }) {
  return (
    <a
      href={props.repo.url}
      target="_blank"
      rel="noopener noreferrer"
      class="project-card"
    >
      <div class="project-top">
        <span class="project-name">{props.repo.name}</span>
        {props.repo.stars > 0 && (
          <span class="project-stars">★ {props.repo.stars}</span>
        )}
      </div>
      {props.repo.description && (
        <p class="project-desc">{props.repo.description}</p>
      )}
      <div class="project-bottom">
        {props.repo.language && (
          <span class="project-lang">
            <span
              class="lang-dot"
              style={{
                background: LANG_COLOR[props.repo.language] ?? "#9b8890",
              }}
            />
            {props.repo.language}
          </span>
        )}
        {props.repo.homepage && <span class="project-live">↗ live</span>}
      </div>
    </a>
  );
}

export default function Projects() {
  const [repos, setRepos] = createSignal<Repo[]>([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(false);
  const [expanded, setExpanded] = createSignal(false);

  const displayedRepos = () => expanded() ? repos() : repos().slice(0, INITIAL_SHOW);
  const hasMore = () => repos().length > INITIAL_SHOW;

  onMount(async () => {
    try {
      const data = await fetchRepos();
      setRepos(data);
      setError(false);
    } catch (err) {
      console.error("Error fetching repos:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  });

  return (
    <div class="projects-container">
      <div class="projects-grid" classList={{ "collapsed": !expanded() && !loading() }}>
        <Show
          when={!loading()}
          fallback={
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          }
        >
          <Show
            when={!error()}
            fallback={<p class="projects-placeholder">couldn't load repos :(</p>}
          >
            <For each={repos()}>
              {(repo) => (
                <ProjectCard repo={repo} />
              )}
            </For>
          </Show>
        </Show>
      </div>
      <Show when={hasMore() && !loading()}>
        <button
          class="show-more-btn"
          onClick={() => setExpanded(!expanded())}
        >
          {expanded() ? "Show Less" : `Show More (${repos().length - INITIAL_SHOW})`}
        </button>
      </Show>
    </div>
  );
}