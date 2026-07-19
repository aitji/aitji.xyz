(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    var allRepos = []
    var activeLang = "all"

    function shellHTML() {
        return (
            '<div class="projects-page container">' +
            '<h1 class="page-title">projects</h1>' +
            '<p class="page-lede">things i\'ve built, mostly for fun, occasionally on purpose. ' +
            'each one gets its own writeup.</p>' +
            '<div class="filter-row" id="lang-filters"></div>' +
            '<p class="post-count" id="repo-count"></p>' +
            '<div class="post-list" id="projects-list"></div>' +
            "</div>"
        )
    }

    function skeletonHTML(n) {
        var one =
            '<div class="post-card skeleton-card">' +
            '<div class="skeleton-title" style="width:40%;height:0.9rem;margin-bottom:0.6rem"></div>' +
            '<div class="skeleton-desc" style="height:2.5rem"></div>' +
            "</div>"
        return new Array(n).fill(one).join("")
    }

    var u = AITJI.Utils
    function cardHTML(repo) {
        var slug = u.slugify(repo.name)
        var updated = repo.updated || repo.updated_at || repo.pushed_at
        var tags = ([repo.language].filter(Boolean)).concat(repo.topics || [])

        return (
            '<a href="/projects/' + slug + '" class="post-card">' +
            '<div class="post-card-top">' +
            (repo.language
                ? '<span class="lang-dot" style="background:' + (u.LANG_COLOR[repo.language] || "#9b8890") + '"></span><span>' + u.escapeHtml(repo.language) + "</span><span aria-hidden='true'>&middot;</span>"
                : "") +
            (repo.stars > 0 ? '<span>\u2605 ' + repo.stars + " stars</span><span aria-hidden='true'>&middot;</span>" : "") +
            (updated ? u.iconSpan("calendar") + "<span>" + u.formatDate(String(updated).slice(0, 10)) + "</span>" : "") +
            "</div>" +
            '<p class="post-card-title">' + u.escapeHtml(repo.name) + "</p>" +
            '<p class="post-card-excerpt">' + (repo.description ? u.escapeHtml(repo.description) : "no description yet. click through for details.") + "</p>" +
            (tags.length ? '<div class="post-card-tags">' + tags.slice(0, 5).map(function (t) { return '<span class="tag">' + u.escapeHtml(t) + "</span>" }).join("") + "</div>" : "") +
            "</a>"
        )
    }

    function renderList() {
        var list = document.getElementById("projects-list")
        var count = document.getElementById("repo-count")
        if (!list) return
        var repos = activeLang === "all" ? allRepos : allRepos.filter(function (r) { return r.language === activeLang })

        if (count) count.textContent = repos.length + (repos.length === 1 ? " project" : " projects")
        list.innerHTML = repos.length
            ? repos.map(cardHTML).join("")
            : '<p class="empty-state">nothing here for that filter.</p>'
    }

    function renderFilters() {
        var mount = document.getElementById("lang-filters")
        if (!mount) return

        var langs = {}
        allRepos.forEach(function (r) { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1 })
        var sortedLangs = Object.keys(langs).sort(function (a, b) { return langs[b] - langs[a] })

        var u = AITJI.Utils
        var chips = ['<button class="filter-chip' + (activeLang === "all" ? " active" : "") + '" data-lang="all">all (' + allRepos.length + ")</button>"]
        sortedLangs.forEach(function (lang) {
            chips.push(
                '<button class="filter-chip' + (activeLang === lang ? " active" : "") + '" data-lang="' + u.escapeHtml(lang) + '">' +
                '<span class="lang-dot" style="background:' + (u.LANG_COLOR[lang] || "#9b8890") + '"></span>' +
                u.escapeHtml(lang) + " (" + langs[lang] + ")</button>"
            )
        })
        mount.innerHTML = chips.join("")

        mount.querySelectorAll(".filter-chip").forEach(function (btn) {
            btn.addEventListener("click", function () {
                activeLang = btn.dataset.lang
                renderFilters()
                renderList()
            })
        })
    }

    AITJI.Router.registerView("projects", {
        title: "projects",
        description: "things aitji built, mostly for fun, occasionally on purpose.",
        render: async function (container) {
            activeLang = "all"
            container.innerHTML = shellHTML()
            document.getElementById("projects-list").innerHTML = skeletonHTML(5)

            try {
                allRepos = await AITJI.Data.fetchRepos()
            } catch (e) {
                allRepos = []
                var list = document.getElementById("projects-list")
                if (list) list.innerHTML = '<p class="empty-state">couldn\'t load repos :(</p>'
                return
            }

            if (!document.getElementById("projects-list")) return // route changed mid-fetch
            renderFilters()
            renderList()
        }
    })
})()
