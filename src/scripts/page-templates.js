(function () {
    "use strict"

    window.AITJI = window.AITJI || {}

    var SKILLS = [
        { label: "languages", tags: ["javascript", "typescript", "python", "php", "html", "css", "json", "yaml"] },
        { label: "frameworks", tags: ["astro", "solidjs", "react", "vue", "next.js", "nuxt", "express", "fastify"] },
        { label: "ui", tags: ["tailwind css", "bootstrap", "material ui"] },
        { label: "developer tools", tags: ["git", "github", "bash", "powershell", "vite", "webpack", "rollup*", "eslint", "prettier", "ffmpeg", "aria2c"] },
        { label: "platforms", tags: ["vercel", "cloudflare", "github pages", "firebase"] },
        { label: "apis", tags: ["serverless", "workers", "rest", "websocket", "server send event"] },
        { label: "devops", tags: ["github actions", "nginx"] },
        { label: "operating systems", tags: ["windows", "linux-nixos"] }
    ]

    const sortedBlogs = () => (AITJI.BLOGS || [])
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))

    function socialsRow() {
        var u = AITJI.Utils
        return [
            { href: "mailto:me@aitji.xyz", icon: "email", label: "me", ext: false },
            { href: "https://github.com/aitji", icon: "github", label: "github", ext: true },
            { href: "https://www.curseforge.com/members/aitji/projects", icon: "curseforge", label: "curseforge", ext: true },
            { href: "https://www.youtube.com/@aitji-gamer", icon: "youtube", label: "youtube", ext: true },
            { href: "https://aitji.xyz/discord", icon: "discord", label: "discord", ext: true },
            { href: "https://x.com/aitji_", icon: "twitter-x", label: "x", ext: true },
            { href: "https://reddit.com/u/aitji", icon: "reddit", label: "reddit", ext: true }
        ].map(function (it) {
            return (
                '<a href="' + it.href + '" class="social-btn"' +
                (it.ext ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
                u.iconSpan(it.icon) + "<span>" + it.label + "</span></a>"
            )
        }).join("")
    }

    function friendGrid() {
        var u = AITJI.Utils
        var html = [
            { name: "picker", desc: "pixel human", url: "https://github.com/pickerth-12", icon: "github" },
            { name: "mineners", desc: "math human", url: "https://github.com/minenersGaming", icon: "github" },
            { name: "encyptAES", desc: "network human", url: "https://github.com/encyptAES", icon: "github" },
            { name: "n1gh7shadez", desc: "gaming human", url: "https://n1gh7shadez.vercel.app", icon: "domain" },
            { name: "t4nluxz", desc: "pvp human", url: "https://github.com/t4nluxz7-bot", icon: "github" }
        ].map(function (f) {
            return (
                '<a href="' + f.url + '" title="' + f.url + '" class="friend-card" target="_blank" rel="noopener noreferrer">' +
                '<span class="friend-name">' + f.name + '</span>' +
                '<span class="friend-desc muted">' + f.desc + '</span>' +
                '<span class="friend-url muted">' + u.iconSpan(f.icon) + "</span>" +
                "</a>"
            )
        }).join("")

        return html + '<span class="friend-card"><span class="friend-name">vongwean</span><span class="friend-desc muted">art human</span></span>'
    }

    function blogPreviewHTML() {
        var posts = sortedBlogs().slice(0, 3)
        if (!posts.length) return '<p class="empty-state">nothing written yet.</p>'

        var u = AITJI.Utils
        return '<div class="blog-preview-list">' + posts.map(function (post) {
            return (
                '<a href="/blogs/' + post.slug + '" class="blog-preview-card">' +
                '<span class="blog-preview-title">' + u.escapeHtml(post.title) + "</span>" +
                '<span class="blog-preview-date">' + u.formatDate(post.date) + "</span>" +
                "</a>"
            )
        }).join("") + "</div>"
    }

    function home(repos, limit) {
        repos = Array.isArray(repos) ? repos : []
        limit = limit || 6
        var projects = repos.length
            ? repos.slice(0, limit).map(AITJI.ProjectUI.cardHTML).join("")
            : AITJI.ProjectUI.skeletonCards(limit)

        return (
            '<div class="page">' +
            '<section class="hero container">' +
            '<div class="hero-name-row"><h1 class="hero-name">aitji</h1></div>' +
            '<div class="hero-meta">' +
            '<span id="hero-discord-slot"><span class="discord-loading"></span></span>' +
            '<span class="meta-sep" aria-hidden="true">&middot;</span>' +
            '<span class="clock" id="hero-clock" title="thailand, gmt+7"></span>' +
            '<span class="meta-tz muted">gmt+7</span>' +
            "</div>" +
            '<p class="hero-sub">self-taught developer &amp; (sort of) full-stack web dev.' +
            '<br class="br-hide" />i use lowercase letters.</p>' +
            "</section>" +
            '<section class="section container" id="about">' +
            '<p class="section-label">about</p>' +
            '<div class="card">' +
            "<p>hey, i'm <strong>aitji</strong> a developer who builds things. i like making stuff. " +
            "currently figuring out what to do with this domain.</p>" +
            '<div class="tag-row" style="margin-top:0.85rem">' +
            '<span class="tag">javascript</span><span class="tag">typescript</span><span class="tag">python</span>' +
            '<span class="tag">solidjs</span><span class="tag">vercel</span>' +
            "</div></div>" +
            '<a href="/about" class="section-more">more about me</a>' +
            "</section>" +
            '<section class="section container" id="links">' +
            '<p class="section-label">links</p>' +
            '<div class="socials-row">' + socialsRow() + "</div>" +
            "</section>" +
            '<section class="section container" id="writing">' +
            '<p class="section-label">writing</p>' +
            blogPreviewHTML() +
            '<a href="/blogs" class="section-more">read more posts</a>' +
            "</section>" +
            '<section class="section container" id="projects">' +
            '<p class="section-label">projects</p>' +
            '<div class="projects-container collapsed"><div class="projects-grid" id="home-projects-grid">' + projects + "</div></div>" +
            '<a href="/projects" class="section-more">view all projects</a>' +
            "</section>" +
            '<section class="section container" id="friends">' +
            '<p class="section-label">friends</p>' +
            '<div class="friends-grid">' + friendGrid() + "</div>" +
            "</section>" +
            "</div>"
        )
    }

    function skillsHTML() {
        return SKILLS.map(function (group) {
            return (
                '<div class="skill-group">' +
                '<p class="skill-group-label">' + group.label + "</p>" +
                '<div class="tag-row">' + group.tags.map(function (tag) { return '<span class="tag">' + tag + "</span>" }).join("") + "</div>" +
                "</div>"
            )
        }).join("")
    }

    function about() {
        var u = AITJI.Utils
        return (
            '<div class="about-page container">' +
            '<h1 class="page-title">about me</h1>' +
            '<p class="page-lede">the longer version of the one-liner on the home page.</p>' +
            '<section class="section"><div class="bio">' +
            "<p>i'm <strong>aitji</strong>, a self-taught developer who enjoys building things for the web. i mostly work with javascript and typescript, and i care a lot about writing code that's simple, readable, and fast, " +
            "outside of programming, i'm student public relations &amp; ex-council. i also have a terrible short-term memory.</p>" +
            "<p>i prefer lowercase letters, clean interfaces, and i'm always trying to improve a little thing.</p>" +
            "</div></section>" +
            '<section class="section"><p class="section-label">quick facts</p><div class="facts-grid">' +
            '<div class="fact-card"><p class="fact-label">based in</p><p class="fact-value">thailand</p></div>' +
            '<div class="fact-card"><p class="fact-label">timezone</p><p class="fact-value">gmt+7</p></div>' +
            '<div class="fact-card"><p class="fact-label">focus</p><p class="fact-value">tools &amp; web</p></div>' +
            '<div class="fact-card"><p class="fact-label">style</p><p class="fact-value">lowercase, always</p></div>' +
            "</div></section>" +
            '<section class="section"><p class="section-label">skills</p>' + skillsHTML() + "</section>" +
            '<section class="section"><p class="section-label">get in touch</p><div class="socials-row">' +
            '<a href="mailto:me@aitji.xyz" class="social-btn">' + u.iconSpan("email") + "<span>me</span></a>" +
            '<a href="https://github.com/aitji" class="social-btn" target="_blank" rel="noopener noreferrer">' + u.iconSpan("github") + "<span>github</span></a>" +
            '<a href="https://aitji.xyz/discord" class="social-btn" target="_blank" rel="noopener noreferrer">' + u.iconSpan("discord") + "<span>discord</span></a>" +
            "</div></section>" +
            "</div>"
        )
    }

    function blogCardHTML(post) {
        var u = AITJI.Utils
        return (
            '<a href="/blogs/' + post.slug + '" class="post-card">' +
            '<div class="post-card-top">' +
            u.iconSpan("calendar") + "<span>" + u.formatDate(post.date) + "</span>" +
            '<span aria-hidden="true">&middot;</span>' +
            u.iconSpan("clock") + "<span>" + u.readingTime(post.content) + "</span>" +
            "</div>" +
            '<p class="post-card-title">' + u.escapeHtml(post.title) + "</p>" +
            '<p class="post-card-excerpt">' + u.escapeHtml(post.excerpt) + "</p>" +
            '<div class="post-card-tags">' + post.tags.map(function (tag) { return '<span class="tag">' + tag + "</span>" }).join("") + "</div>" +
            "</a>"
        )
    }

    function blogs() {
        var posts = sortedBlogs()
        var body = posts.length
            ? '<div class="post-list">' + posts.map(blogCardHTML).join("") + "</div>"
            : '<p class="empty-state">nothing written yet, check back later.</p>'

        return (
            '<div class="blogs-page container">' +
            '<h1 class="page-title">blogs</h1>' +
            '<p class="page-lede">notes on things i built, broke, or thought about for too long.</p>' +
            '<p class="post-count">' + posts.length + (posts.length === 1 ? " post" : " posts") + "</p>" +
            body +
            "</div>"
        )
    }

    function blogNavLinkHTML(post, direction) {
        if (!post) return "<span></span>"
        return (
            '<a href="/blogs/' + post.slug + '" class="post-nav-link ' + direction + '">' +
            '<span class="post-nav-dir">' + (direction === "next" ? "next" : "previous") + "</span>" +
            '<span class="post-nav-title">' + AITJI.Utils.escapeHtml(post.title) + "</span>" +
            "</a>"
        )
    }

    function blogPostNotFound() {
        return (
            '<div class="post-page container">' +
            '<a href="/blogs" class="back-link">' + AITJI.Utils.iconSpan("arrow-left") + "<span>back to blogs</span></a>" +
            '<h1 class="page-title">post not found</h1>' +
            '<p class="muted">that one doesn\'t exist, or got moved.</p>' +
            "</div>"
        )
    }

    function blogPost(slug) {
        var sorted = sortedBlogs()
        var index = sorted.findIndex(function (post) { return post.slug === slug })
        if (index === -1) return { html: blogPostNotFound(), post: null }

        var post = sorted[index]
        var next = index > 0 ? sorted[index - 1] : null
        var prev = index < sorted.length - 1 ? sorted[index + 1] : null
        var u = AITJI.Utils

        return {
            post: post,
            html: (
                '<div class="post-page container">' +
                '<a href="/blogs" class="back-link">' + u.iconSpan("arrow-left") + "<span>back to blogs</span></a>" +
                '<div class="with-toc"><div>' +
                '<header class="post-header">' +
                '<h1 class="post-title">' + u.escapeHtml(post.title) + "</h1>" +
                '<div class="post-meta-row">' +
                '<span class="post-meta-item">' + u.iconSpan("calendar") + "<span>" + u.formatDate(post.date) + "</span></span>" +
                '<span class="post-meta-item">' + u.iconSpan("clock") + "<span>" + u.readingTime(post.content) + "</span></span>" +
                "</div>" +
                '<div class="tag-row">' + post.tags.map(function (tag) { return '<span class="tag">' + tag + "</span>" }).join("") + "</div>" +
                "</header>" +
                '<article class="post-content" id="post-content">' + post.content + "</article>" +
                '<nav class="post-footer-nav">' + blogNavLinkHTML(prev, "prev") + blogNavLinkHTML(next, "next") + "</nav>" +
                "</div>" +
                '<aside class="toc" id="toc-mount"></aside>' +
                "</div></div>"
            )
        }
    }

    function projectCardHTML(repo) {
        var u = AITJI.Utils
        var slug = u.slugify(repo.name)
        var updated = repo.updated || repo.updated_at || repo.pushed_at
        var tags = ([repo.language].filter(Boolean)).concat(repo.topics || [])

        return (
            '<a href="/projects/' + slug + '" class="post-card">' +
            '<div class="post-card-top">' +
            (repo.language
                ? '<span class="lang-dot" style="background:' + (u.LANG_COLOR[repo.language] || "#9b8890") + '"></span><span>' + u.escapeHtml(repo.language) + '</span><span aria-hidden="true">&middot;</span>'
                : "") +
            (repo.stars > 0 ? "<span>★ " + repo.stars + ' stars</span><span aria-hidden="true">&middot;</span>' : "") +
            (updated ? u.iconSpan("calendar") + "<span>" + u.formatDate(String(updated).slice(0, 10)) + "</span>" : "") +
            "</div>" +
            '<p class="post-card-title">' + u.escapeHtml(repo.name) + "</p>" +
            '<p class="post-card-excerpt">' + (repo.description ? u.escapeHtml(repo.description) : "no description yet. click through for details.") + "</p>" +
            (tags.length ? '<div class="post-card-tags">' + tags.slice(0, 5).map(function (tag) { return '<span class="tag">' + u.escapeHtml(tag) + "</span>" }).join("") + "</div>" : "") +
            "</a>"
        )
    }

    function projectFiltersHTML(repos, activeLang) {
        var langs = {}
        repos.forEach(function (repo) {
            if (repo.language) langs[repo.language] = (langs[repo.language] || 0) + 1
        })

        var sortedLangs = Object.keys(langs).sort(function (a, b) { return langs[b] - langs[a] })
        var u = AITJI.Utils
        var chips = ['<button class="filter-chip' + (activeLang === "all" ? " active" : "") + '" data-lang="all">all (' + repos.length + ")</button>"]

        sortedLangs.forEach(function (lang) {
            chips.push(
                '<button class="filter-chip' + (activeLang === lang ? " active" : "") + '" data-lang="' + u.escapeHtml(lang) + '">' +
                '<span class="lang-dot" style="background:' + (u.LANG_COLOR[lang] || "#9b8890") + '"></span>' +
                u.escapeHtml(lang) + " (" + langs[lang] + ")</button>"
            )
        })

        return chips.join("")
    }

    function filteredRepos(repos, activeLang) {
        return activeLang === "all" ? repos : repos.filter(function (repo) { return repo.language === activeLang })
    }

    function projectListHTML(repos, activeLang) {
        var filtered = filteredRepos(repos, activeLang)
        return filtered.length
            ? filtered.map(projectCardHTML).join("")
            : '<p class="empty-state">nothing here for that filter.</p>'
    }

    function projectCount(repos, activeLang) {
        var count = filteredRepos(repos, activeLang).length
        return count + (count === 1 ? " project" : " projects")
    }

    function projects(repos, activeLang) {
        repos = Array.isArray(repos) ? repos : []
        activeLang = activeLang || "all"
        return (
            '<div class="projects-page container">' +
            '<h1 class="page-title">projects</h1>' +
            '<p class="page-lede">things i\'ve built, mostly for fun, occasionally on purpose. each one gets its own writeup.</p>' +
            '<div class="filter-row" id="lang-filters">' + projectFiltersHTML(repos, activeLang) + "</div>" +
            '<p class="post-count" id="repo-count">' + projectCount(repos, activeLang) + "</p>" +
            '<div class="post-list" id="projects-list">' + projectListHTML(repos, activeLang) + "</div>" +
            "</div>"
        )
    }

    function projectsLoading() {
        var one =
            '<div class="post-card skeleton-card">' +
            '<div class="skeleton-title" style="width:40%;height:0.9rem;margin-bottom:0.6rem"></div>' +
            '<div class="skeleton-desc" style="height:2.5rem"></div>' +
            "</div>"

        return (
            '<div class="projects-page container">' +
            '<h1 class="page-title">projects</h1>' +
            '<p class="page-lede">things i\'ve built, mostly for fun, occasionally on purpose. each one gets its own writeup.</p>' +
            '<div class="filter-row" id="lang-filters"></div>' +
            '<p class="post-count" id="repo-count"></p>' +
            '<div class="post-list" id="projects-list">' + new Array(5).fill(one).join("") + "</div>" +
            "</div>"
        )
    }

    function projectLoading() {
        return (
            '<div class="post-page container detail-loading">' +
            '<a href="/projects" class="back-link">' + AITJI.Utils.iconSpan("arrow-left") + "<span>back to projects</span></a>" +
            '<div class="skeleton-title" style="height:2rem;width:50%;margin-bottom:1rem"></div>' +
            '<div class="skeleton-desc" style="height:4rem;width:100%;margin-bottom:1.5rem"></div>' +
            '<div class="skeleton-lang" style="height:1.5rem;width:8rem"></div>' +
            "</div>"
        )
    }

    function projectNotFound() {
        return (
            '<div class="post-page container">' +
            '<a href="/projects" class="back-link">' + AITJI.Utils.iconSpan("arrow-left") + "<span>back to projects</span></a>" +
            '<h1 class="page-title">project not found</h1>' +
            '<p class="muted">couldn\'t find a repo matching that slug.</p>' +
            "</div>"
        )
    }

    function projectContent(repo) {
        var u = AITJI.Utils
        var topics = repo.topics || []
        var html = "<h2>overview</h2>"
        html += "<p>" + (repo.description ? u.escapeHtml(repo.description) : "no description written for this one yet. check the source for details.") + "</p>"
        html += "<h2>tech stack</h2><div class=\"tag-row\">"
        if (repo.language) html += '<span class="tag">' + u.escapeHtml(repo.language) + "</span>"
        topics.forEach(function (topic) { html += '<span class="tag">' + u.escapeHtml(topic) + "</span>" })
        if (!repo.language && !topics.length) html += '<span class="muted" style="font-size:0.85rem">not specified.</span>'
        html += "</div><h2>links</h2><div class=\"cta-row\">"
        html += '<a href="' + repo.url + '" class="btn btn-accent" target="_blank" rel="noopener noreferrer">' + u.iconSpan("external-link") + "<span>view on github</span></a>"
        if (repo.homepage) html += '<a href="' + repo.homepage + '" class="btn" target="_blank" rel="noopener noreferrer">' + u.iconSpan("external-link") + "<span>live demo</span></a>"
        return html + "</div>"
    }

    function projectDetail(repo) {
        if (!repo) return projectNotFound()

        var u = AITJI.Utils
        var forks = repo.forks || repo.forks_count
        var updated = repo.updated || repo.updated_at || repo.pushed_at
        var metaItems = []

        if (repo.language) {
            metaItems.push(
                '<span class="post-meta-item"><span class="lang-dot" style="background:' +
                (u.LANG_COLOR[repo.language] || "#9b8890") + '"></span><span>' + u.escapeHtml(repo.language) + "</span></span>"
            )
        }
        if (repo.stars > 0) metaItems.push('<span class="post-meta-item">★ ' + repo.stars + "</span>")
        if (forks) metaItems.push('<span class="post-meta-item">' + u.iconSpan("fork") + "<span>" + forks + "</span></span>")
        if (updated) metaItems.push('<span class="post-meta-item">' + u.iconSpan("calendar") + "<span>updated " + u.formatDate(String(updated).slice(0, 10)) + "</span></span>")

        return (
            '<div class="post-page container">' +
            '<a href="/projects" class="back-link">' + u.iconSpan("arrow-left") + "<span>back to projects</span></a>" +
            '<div class="with-toc"><div>' +
            '<header class="post-header">' +
            '<h1 class="post-title mono">' + u.escapeHtml(repo.name) + "</h1>" +
            (metaItems.length ? '<div class="post-meta-row">' + metaItems.join("") + "</div>" : "") +
            "</header>" +
            '<article class="post-content" id="post-content">' + projectContent(repo) + "</article>" +
            "</div>" +
            '<aside class="toc" id="toc-mount"></aside>' +
            "</div></div>"
        )
    }

    function notFound(pathname) {
        var safePath = u.escapeHtml(pathname || "/somewhere")
        return (
            '<div class="not-found container">' +
            '<div class="nf-copy">' +
            '<p class="nf-kicker">route resolution failed</p>' +
            '<div class="nf-number" aria-label="error 404"><span>4</span><span class="nf-zero">0</span><span>4</span></div>' +
            '<h1 class="nf-title">this page wandered off.</h1>' +
            '<p class="nf-sub">checked the cache, the router, and under the keyboard</p>' +
            '<div class="nf-terminal" aria-label="missing route details">' +
            '<div class="nf-terminal-bar" aria-hidden="true"><span></span><span></span><span></span><b>route-check.sh</b></div>' +
            '<div class="nf-terminal-body">' +
            '<p><span class="nf-prompt">$</span> resolve <code>' + safePath + '</code></p>' +
            '<p><span class="nf-key">status</span> 404_not_found</p>' +
            '<p><span class="nf-key">mewo</span> <span class="nf-cat">/\_/\<br />( o.o )<br />&gt; ^ &lt;</span></p>' +
            '<p><span class="nf-key">hint</span> try a route that exists</p>' +
            '</div></div>' +
            '<nav class="nf-actions" aria-label="working routes">' +
            '<a href="/" class="btn btn-accent">home</a>' +
            '<a href="/blogs" class="btn">blogs</a>' +
            '<a href="/projects" class="btn">projects</a>' +
            '<button type="button" class="btn" id="go-back">go back</button>' +
            '</nav></div>' +
            '<div class="nf-orbit" aria-hidden="true"><span class="nf-orbit-ring"></span><span class="nf-orbit-dot"></span><span class="nf-orbit-core">?</span></div>' +
            '</div>'
        )
    }

    function privacy() {
        return (
            '<div class="legal-page container">' +
            '<p class="legal-stamp">last updated 1 august 2026</p>' +
            '<h1 class="page-title">privacy</h1>' +
            '<p class="legal-intro">this is a small personal site. it has no accounts, payments, advertising, or form that asks for personal details. some technical data is still processed so pages can load, stay secure, and optionally produce basic traffic statistics.</p>' +
            '<div class="legal-content">' +
            '<section class="legal-section legal-callout" id="summary"><h2>the useful summary</h2>' +
            '<p>vercel handles normal web requests. cloudflare manages the domain, with some DNS records served through google. google analytics is on by default unless your browser sends a recognized privacy signal, and you can turn it off below at any time.</p>' +
            '<div class="privacy-control"><button class="btn btn-accent" type="button" id="analytics-toggle">checking analytics...</button><span class="privacy-control-state" id="analytics-state" aria-live="polite"></span></div>' +
            '</section>' +
            '<section class="legal-section" id="collected"><h2>what gets processed</h2><ul>' +
            '<li><strong>request data:</strong> hosting and network providers can receive your IP address, requested URL, timestamps, browser or device details, approximate location derived from IP, and security, error, or performance information.</li>' +
            '<li><strong>analytics, on by default:</strong> unless you turn it off or your browser sends a recognized privacy signal, google analytics 4 receives page URLs and titles, referrers, browser and device details, language, approximate region, and interaction events. this site disables google signals and advertising-personalization signals. google says an IP address may be used transiently to provide the service and infer approximate location, but is not logged or stored as an individual IP address in GA4.</li>' +
            '<li><strong>browser storage:</strong> <code>sessionStorage</code> keeps a repository-data cache for about five minutes. the schedule tool stores its timetable and reduction setting in <code>localStorage</code>. the analytics choice stores only <code>on</code> or <code>off</code>.</li>' +
            '<li><strong>public project and status data:</strong> project listings normally load from a file served by this site; if that fails, your browser may request the same public data directly from jsdelivr (a CDN that mirrors public github content), or a server-side api on this site fetches it from github instead. discord status always goes through a server-side api on this site, which checks a public lanyard endpoint and falls back to a direct bot connection if lanyard is unavailable, so your browser does not contact discord or lanyard directly. visitors are not asked to sign in to github or discord or provide credentials.</li>' +
            '</ul></section>' +
            '<section class="legal-section" id="providers"><h2>services involved</h2><div class="legal-provider-list">' +
            '<div class="legal-provider"><p class="legal-provider-name">vercel</p><p>hosts the static site and API routes, serves files through its network, and may keep operational or security logs. <a href="https://vercel.com/legal/privacy-notice" rel="noopener">vercel privacy</a></p></div>' +
            '<div class="legal-provider"><p class="legal-provider-name">google</p><p>provides google analytics, on by default and can be turned off below, and remotely hosted fonts, which load on every visit regardless of the analytics choice. loading either sends a request to google, and some DNS records for this domain are also served through google. <a href="https://policies.google.com/privacy" rel="noopener">google privacy</a></p></div>' +
            '<div class="legal-provider"><p class="legal-provider-name">cloudflare</p><p>manages the domain and most DNS records. if a DNS record is proxied, cloudflare may also process connection and request metadata. <a href="https://www.cloudflare.com/policies/privacy/" rel="noopener">cloudflare privacy</a></p></div>' +
            '<div class="legal-provider"><p class="legal-provider-name">github, jsdelivr, discord, and lanyard</p><p>provide public project or status information used by parts of the site. github and jsdelivr may receive a request directly from your browser if the cached copy on this site is unavailable; discord and lanyard are only ever contacted by a server-side api on this site, not by your browser directly. their own policies apply when they receive a request.</p></div>' +
            '</div></section>' +
            '<section class="legal-section" id="cookies"><h2>analytics, cookies, and choices</h2>' +
            '<p>google analytics loads automatically on this site unless a recognized privacy signal is present in your browser or you have turned it off. once loaded, it can set first-party cookies such as <code>_ga</code> to distinguish visits and sessions. turning analytics off blocks future analytics calls from this site and attempts to remove its cookies for this domain.</p>' +
            '<p>global privacy control and the common do-not-track signal keep analytics off automatically, even on a first visit, before any choice is made. browser cookie controls, extensions, and network blockers can provide additional control.</p>' +
            '</section>' +
            '<section class="legal-section" id="retention"><h2>retention and requests</h2>' +
            '<p>browser storage remains on your device until it expires, is replaced, or you clear it. provider-side logs and analytics data follow the retention settings and privacy terms of each provider. because this site has no user accounts, there is usually no profile here to retrieve or delete.</p>' +
            '<p>for a privacy question or request connected to data controlled by this site, email <a href="mailto:me@aitji.xyz">me@aitji.xyz</a>. do not send secrets through ordinary email.</p>' +
            '</section>' +
            '<section class="legal-section" id="children"><h2>children</h2><p>the site is a general personal portfolio and is not designed to collect personal information from children. please do not submit personal details through linked contact channels if you are not comfortable doing so.</p></section>' +
            '<section class="legal-section" id="changes"><h2>changes</h2><p>this notice may change when the site, hosting, or analytics setup changes. the date at the top will be updated when that happens.</p></section>' +
            '</div></div>'
        )
    }

    function tos() {
        return (
            '<div class="legal-page container">' +
            '<p class="legal-stamp">last updated 1 august 2026</p>' +
            '<h1 class="page-title">terms</h1>' +
            '<p class="legal-intro">these terms are intentionally small because this is a personal portfolio, blog, and project index rather than a paid service.</p>' +
            '<div class="legal-content">' +
            '<section class="legal-section legal-callout" id="use"><h2>using the site</h2><p>you may browse, link to, and share public pages. please do not try to disrupt the site, overload its APIs, bypass access controls, impersonate the site or its owner, or use it for unlawful activity.</p></section>' +
            '<section class="legal-section" id="content"><h2>content and source code</h2><p>unless a page says otherwise, written content and personal branding remain owned by aitji. source code published in the linked repository is available under the license included with that repository. third-party names, logos, code, and media remain subject to their own licenses and rights.</p></section>' +
            '<section class="legal-section" id="accuracy"><h2>accuracy and availability</h2><p>content is provided for general information and personal documentation. it may be incomplete, outdated, experimental, or delightfully questionable. there is no promise that the site or any project will always be available, error-free, secure, or suitable for a particular purpose.</p></section>' +
            '<section class="legal-section" id="external"><h2>external links and services</h2><p>the site links to other websites and may display public information obtained from third-party APIs. those services have their own terms and privacy practices. a link does not mean endorsement, ownership, or control.</p></section>' +
            '<section class="legal-section" id="liability"><h2>liability</h2><p>to the extent allowed by applicable law, use of the site and its code is at your own risk. aitji is not responsible for indirect loss, lost data, downtime, or damage caused by relying on content or third-party services. rights that cannot legally be excluded still apply.</p></section>' +
            '<section class="legal-section" id="changes"><h2>changes and contact</h2><p>these terms may be updated as the site changes. continued use after an update means you accept the revised terms. questions can be sent to <a href="mailto:me@aitji.xyz">me@aitji.xyz</a>.</p></section>' +
            '</div></div>'
        )
    }

    window.AITJI.PageTemplates = {
        home: home,
        about: about,
        blogs: blogs,
        blogPost: blogPost,
        projects: projects,
        projectsLoading: projectsLoading,
        projectFiltersHTML: projectFiltersHTML,
        projectListHTML: projectListHTML,
        projectCount: projectCount,
        projectLoading: projectLoading,
        projectNotFound: projectNotFound,
        projectDetail: projectDetail,
        notFound: notFound,
        privacy: privacy,
        tos: tos
    }
})()