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

    const sortedNotes = () => (AITJI.NOTES || [])
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

    function notePreviewHTML() {
        var notes = sortedNotes().slice(0, 3)
        if (!notes.length) return '<p class="empty-state">nothing here yet.</p>'

        var u = AITJI.Utils
        return '<div class="blog-preview-list">' + notes.map(function (n) {
            return (
                '<a href="/notes#' + n.id + '" class="blog-preview-card">' +
                '<span class="blog-preview-title">' + u.escapeHtml(n.text) + "</span>" +
                '<span class="blog-preview-date">' + u.formatDate(n.date) + "</span>" +
                "</a>"
            )
        }).join("") + "</div>"
    }

    function home(list, limit) {
        list = Array.isArray(list) ? list : []
        limit = limit || 6
        var projects = list.slice(0, limit).map(AITJI.ProjectUI.cardHTML).join("")

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
            "<p>hey, i'm <strong>aitji</strong>, a developer who builds things, mostly minecraft bedrock addons and web tools. " +
            "i also run the small infrastructure behind my school's website.</p>" +
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
            '<section class="section container" id="notes">' +
            '<p class="section-label">notes</p>' +
            notePreviewHTML() +
            '<a href="/notes" class="section-more">all notes</a>' +
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
            "<p>i'm <strong>aitji</strong>, a self-taught developer from thailand. i mostly work with javascript and typescript, and i care a lot about writing code that's simple, readable, and fast.</p>" +
            "<p>most of what i make is for minecraft bedrock, like the addons chain of mining and quality of features. the rest is web tools, a browser extension, and the small infrastructure behind my school's website, url shortener, and subdomains.</p>" +
            "<p>outside of programming, i'm student public relations &amp; ex-council. i also have a terrible short-term memory.</p>" +
            "<p>i prefer lowercase letters and clean interfaces, and i'm always trying to improve one little thing.</p>" +
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

    function noteCardHTML(n) {
        var u = AITJI.Utils
        return (
            '<div class="post-card" id="note-' + u.escapeHtml(n.id) + '">' +
            '<div class="post-card-top">' +
            u.iconSpan("calendar") + "<span>" + u.formatDate(n.date) + "</span>" +
            '<a href="/notes#' + u.escapeHtml(n.id) + '" class="muted" aria-label="link to this note">#</a>' +
            "</div>" +
            '<p class="post-card-excerpt">' + u.escapeHtml(n.text) + "</p>" +
            ((n.tags || []).length ? '<div class="post-card-tags">' + n.tags.map(function (tag) { return '<span class="tag">' + u.escapeHtml(tag) + "</span>" }).join("") + "</div>" : "") +
            "</div>"
        )
    }

    function notes() {
        var list = sortedNotes()
        var body = list.length
            ? '<div class="post-list">' + list.map(noteCardHTML).join("") + "</div>"
            : '<p class="empty-state">nothing here yet, check back later.</p>'

        return (
            '<div class="blogs-page container">' +
            '<h1 class="page-title">notes</h1>' +
            '<p class="page-lede">tiny thoughts tiny head</p>' +
            '<p class="post-count">' + list.length + (list.length === 1 ? " note" : " notes") + "</p>" +
            body +
            "</div>"
        )
    }

    function catOf(p) { return AITJI.Utils.CATEGORY_LABEL[p.category] || p.category || "misc" }

    function projectCardHTML(p) {
        var u = AITJI.Utils
        return (
            '<a href="/projects/' + p.slug + '" class="post-card">' +
            '<div class="post-card-top">' +
            '<span class="lang-dot" style="background:' + (u.CATEGORY_COLOR[p.category] || "#9b8890") + '"></span><span>' + u.escapeHtml(catOf(p)) + "</span>" +
            '<span aria-hidden="true">&middot;</span><span>' + u.escapeHtml(p.status || "active") + "</span>" +
            "</div>" +
            '<p class="post-card-title">' + u.escapeHtml(p.name) + "</p>" +
            '<p class="post-card-excerpt">' + u.escapeHtml(p.description) + "</p>" +
            ((p.tags || []).length ? '<div class="post-card-tags">' + p.tags.slice(0, 5).map(function (tag) { return '<span class="tag">' + u.escapeHtml(tag) + "</span>" }).join("") + "</div>" : "") +
            "</a>"
        )
    }

    function projectFiltersHTML(list, active) {
        var u = AITJI.Utils
        var cats = {}
        list.forEach(function (p) { cats[p.category] = (cats[p.category] || 0) + 1 })

        var chips = ['<button class="filter-chip' + (active === "all" ? " active" : "") + '" data-lang="all">all (' + list.length + ")</button>"]
        Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a] }).forEach(function (c) {
            chips.push(
                '<button class="filter-chip' + (active === c ? " active" : "") + '" data-lang="' + u.escapeHtml(c) + '">' +
                '<span class="lang-dot" style="background:' + (u.CATEGORY_COLOR[c] || "#9b8890") + '"></span>' +
                u.escapeHtml(u.CATEGORY_LABEL[c] || c) + " (" + cats[c] + ")</button>"
            )
        })
        return chips.join("")
    }

    function filteredProjects(list, active) {
        return active === "all" ? list : list.filter(function (p) { return p.category === active })
    }

    function projectListHTML(list, active) {
        var f = filteredProjects(list, active)
        return f.length ? f.map(projectCardHTML).join("") : '<p class="empty-state">nothing here for that filter.</p>'
    }

    function projectCount(list, active) {
        var n = filteredProjects(list, active).length
        return n + (n === 1 ? " project" : " projects")
    }

    function projects(list, active) {
        list = Array.isArray(list) ? list : []
        active = active || "all"
        return (
            '<div class="projects-page container">' +
            '<h1 class="page-title">projects</h1>' +
            '<p class="page-lede">things i\'ve built, mostly for fun, occasionally on purpose.</p>' +
            '<div class="filter-row" id="lang-filters">' + projectFiltersHTML(list, active) + "</div>" +
            '<p class="post-count" id="repo-count">' + projectCount(list, active) + "</p>" +
            '<div class="post-list" id="projects-list">' + projectListHTML(list, active) + "</div>" +
            "</div>"
        )
    }

    function projectNotFound() {
        return (
            '<div class="post-page container">' +
            '<a href="/projects" class="back-link">' + AITJI.Utils.iconSpan("arrow-left") + "<span>back to projects</span></a>" +
            '<h1 class="page-title">project not found</h1>' +
            '<p class="muted">couldn\'t find a project matching that slug.</p>' +
            "</div>"
        )
    }

    function projectContent(p) {
        var u = AITJI.Utils
        var html = "<h2>overview</h2><p>" + u.escapeHtml(p.description) + "</p>"
        if (p.story) html += "<h2>the story</h2>" + p.story
        var stats = Object.keys(p.stats || {})
        if (stats.length) {
            html += "<h2>numbers</h2><div class=\"tag-row\">" + stats.map(function (k) {
                return '<span class="tag">' + u.escapeHtml(p.stats[k]) + " " + u.escapeHtml(k) + "</span>"
            }).join("") + "</div>"
        }
        html += "<h2>tech stack</h2><div class=\"tag-row\">"
        ;(p.tags || []).forEach(function (t) { html += '<span class="tag">' + u.escapeHtml(t) + "</span>" })
        if (!(p.tags || []).length) html += '<span class="muted" style="font-size:0.85rem">not specified.</span>'
        html += "</div>"
        if ((p.links || []).length) {
            html += "<h2>links</h2><div class=\"cta-row\">" + p.links.map(function (l, i) {
                return '<a href="' + u.escapeHtml(l.url) + '" class="btn' + (i === 0 ? " btn-accent" : "") + '" target="_blank" rel="noopener noreferrer">' +
                    u.iconSpan("external-link") + "<span>" + u.escapeHtml(l.label) + "</span></a>"
            }).join("") + "</div>"
        }
        return html
    }

    function projectDetail(p) {
        if (!p) return projectNotFound()
        var u = AITJI.Utils
        var meta =
            '<span class="post-meta-item"><span class="lang-dot" style="background:' + (u.CATEGORY_COLOR[p.category] || "#9b8890") + '"></span><span>' + u.escapeHtml(catOf(p)) + "</span></span>" +
            '<span class="post-meta-item"><span>' + u.escapeHtml(p.status || "active") + "</span></span>"

        return (
            '<div class="post-page container">' +
            '<a href="/projects" class="back-link">' + u.iconSpan("arrow-left") + "<span>back to projects</span></a>" +
            '<div class="with-toc"><div>' +
            '<header class="post-header">' +
            '<h1 class="post-title mono">' + u.escapeHtml(p.name) + "</h1>" +
            '<div class="post-meta-row">' + meta + "</div>" +
            "</header>" +
            '<article class="post-content" id="post-content">' + projectContent(p) + "</article>" +
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
            '<a href="/notes" class="btn">notes</a>' +
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
            '<p class="legal-stamp">last updated 30 october 2026</p>' +
            '<h1 class="page-title">privacy</h1>' +
            '<p class="legal-intro">this is a small personal site. it has no accounts, payments, advertising, or form that asks for personal details. some technical data is still processed so pages can load and stay secure. there is no analytics or tracking script on this site.</p>' +
            '<div class="legal-content">' +
            '<section class="legal-section legal-callout" id="summary"><h2>the useful summary</h2>' +
            '<p>vercel handles normal web requests. cloudflare manages the domain, with some DNS records served through google. this site does not use analytics and does not set tracking cookies.</p>' +
            '</section>' +
            '<section class="legal-section" id="collected"><h2>what gets processed</h2><ul>' +
            '<li><strong>request data:</strong> hosting and network providers can receive your IP address, requested URL, timestamps, browser or device details, approximate location derived from IP, and security, error, or performance information.</li>' +
            '<li><strong>browser storage:</strong> the schedule tool stores its timetable and reduction setting in <code>localStorage</code>.</li>' +
            '<li><strong>public status data:</strong> project and note listings are part of this site\'s own files. discord status always goes through a server-side api on this site, which checks a public lanyard endpoint and falls back to a direct bot connection if lanyard is unavailable, so your browser does not contact discord or lanyard directly. visitors are not asked to sign in to github or discord or provide credentials.</li>' +
            '</ul></section>' +
            '<section class="legal-section" id="providers"><h2>services involved</h2><div class="legal-provider-list">' +
            '<div class="legal-provider"><p class="legal-provider-name">vercel</p><p>hosts the static site and API routes, serves files through its network, and may keep operational or security logs. <a href="https://vercel.com/legal/privacy-notice" rel="noopener">vercel privacy</a></p></div>' +
            '<div class="legal-provider"><p class="legal-provider-name">google</p><p>provides remotely hosted fonts, which load on every visit and send a request to google. some DNS records for this domain are also served through google. <a href="https://policies.google.com/privacy" rel="noopener">google privacy</a></p></div>' +
            '<div class="legal-provider"><p class="legal-provider-name">cloudflare</p><p>manages the domain and most DNS records. if a DNS record is proxied, cloudflare may also process connection and request metadata. <a href="https://www.cloudflare.com/policies/privacy/" rel="noopener">cloudflare privacy</a></p></div>' +
            '<div class="legal-provider"><p class="legal-provider-name">jsdelivr, github, discord, and lanyard</p><p>jsdelivr (a CDN that mirrors public github content) serves this site\'s stylesheets, so your browser contacts it directly on every visit. discord and lanyard supply public status information and are only ever contacted by a server-side api on this site, not by your browser directly. their own policies apply when they receive a request.</p></div>' +
            '</div></section>' +
            '<section class="legal-section" id="cookies"><h2>cookies and choices</h2>' +
            '<p>this site does not set its own cookies and does not run analytics. third-party services such as fonts or a proxied cdn may process requests under their own policies. browser cookie controls, extensions, and network blockers can provide additional control.</p>' +
            '</section>' +
            '<section class="legal-section" id="retention"><h2>retention and requests</h2>' +
            '<p>browser storage remains on your device until it expires, is replaced, or you clear it. provider-side logs follow the retention settings and privacy terms of each provider. because this site has no user accounts, there is usually no profile here to retrieve or delete.</p>' +
            '<p>for a privacy question or request connected to data controlled by this site, email <a href="mailto:me@aitji.xyz">me@aitji.xyz</a>. do not send secrets through ordinary email.</p>' +
            '</section>' +
            '<section class="legal-section" id="children"><h2>children</h2><p>the site is a general personal portfolio and is not designed to collect personal information from children. please do not submit personal details through linked contact channels if you are not comfortable doing so.</p></section>' +
            '<section class="legal-section" id="changes"><h2>changes</h2><p>this notice may change when the site or hosting setup changes. the date at the top will be updated when that happens.</p></section>' +
            '</div></div>'
        )
    }

    function tos() {
        return (
            '<div class="legal-page container">' +
            '<p class="legal-stamp">last updated 1 august 2026</p>' +
            '<h1 class="page-title">terms</h1>' +
            '<p class="legal-intro">these terms are intentionally small because this is a personal portfolio, notes, and project index rather than a paid service.</p>' +
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
        notes: notes,
        projects: projects,
        projectFiltersHTML: projectFiltersHTML,
        projectListHTML: projectListHTML,
        projectCount: projectCount,
        projectNotFound: projectNotFound,
        projectDetail: projectDetail,
        notFound: notFound,
        privacy: privacy,
        tos: tos
    }
})()