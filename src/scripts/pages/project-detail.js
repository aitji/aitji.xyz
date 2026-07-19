(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    function loadingHTML() {
        return (
            '<div class="post-page container detail-loading">' +
            '<a href="/projects" class="back-link">' + AITJI.Utils.iconSpan("arrow-left") + "<span>back to projects</span></a>" +
            '<div class="skeleton-title" style="height:2rem;width:50%;margin-bottom:1rem"></div>' +
            '<div class="skeleton-desc" style="height:4rem;width:100%;margin-bottom:1.5rem"></div>' +
            '<div class="skeleton-lang" style="height:1.5rem;width:8rem"></div>' +
            "</div>"
        )
    }

    function notFoundHTML() {
        return (
            '<div class="post-page container">' +
            '<a href="/projects" class="back-link">' + AITJI.Utils.iconSpan("arrow-left") + "<span>back to projects</span></a>" +
            '<h1 class="page-title">project not found</h1>' +
            '<p class="muted">couldn\'t find a repo matching that slug.</p>' +
            "</div>"
        )
    }

    function buildContent(repo) {
        var u = AITJI.Utils
        var topics = repo.topics || []
        var homepage = repo.homepage

        var html = "<h2>overview</h2>"
        html += "<p>" + (repo.description ? u.escapeHtml(repo.description) : "no description written for this one yet. check the source for details.") + "</p>"

        html += "<h2>tech stack</h2>"
        html += '<div class="tag-row">'
        if (repo.language) html += '<span class="tag">' + u.escapeHtml(repo.language) + "</span>"
        topics.forEach(function (t) { html += '<span class="tag">' + u.escapeHtml(t) + "</span>" })
        if (!repo.language && !topics.length) html += '<span class="muted" style="font-size:0.85rem">not specified.</span>'
        html += "</div>"

        html += "<h2>links</h2>"
        html += '<div class="cta-row">'
        html += '<a href="' + repo.url + '" class="btn btn-accent" target="_blank" rel="noopener noreferrer">' + u.iconSpan("external-link") + "<span>view on github</span></a>"
        if (homepage) html += '<a href="' + homepage + '" class="btn" target="_blank" rel="noopener noreferrer">' + u.iconSpan("external-link") + "<span>live demo</span></a>"
        html += "</div>"

        return html
    }

    function template(repo) {
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
        if (repo.stars > 0) metaItems.push('<span class="post-meta-item">\u2605 ' + repo.stars + "</span>")
        if (forks) metaItems.push('<span class="post-meta-item">' + u.iconSpan("fork") + "<span>" + forks + "</span></span>")
        if (updated) metaItems.push('<span class="post-meta-item">' + u.iconSpan("calendar") + "<span>updated " + u.formatDate(String(updated).slice(0, 10)) + "</span></span>")

        return (
            '<div class="post-page container">' +
            '<a href="/projects" class="back-link">' + u.iconSpan("arrow-left") + "<span>back to projects</span></a>" +

            '<div class="with-toc">' +
            "<div>" +
            '<header class="post-header">' +
            '<h1 class="post-title mono">' + u.escapeHtml(repo.name) + "</h1>" +
            (metaItems.length ? '<div class="post-meta-row">' + metaItems.join("") + "</div>" : "") +
            "</header>" +
            '<article class="post-content" id="post-content">' + buildContent(repo) + "</article>" +
            "</div>" +
            '<aside class="toc" id="toc-mount"></aside>' +
            "</div>" +
            "</div>"
        )
    }

    AITJI.Router.registerView("projects/detail", {
        title: function (params) { return params.slug || "project" },
        description: "project details.",
        render: async function (container, params) {
            container.innerHTML = loadingHTML()

            var repos
            try {
                repos = await AITJI.Data.fetchRepos()
            } catch (e) {
                if (document.querySelector(".detail-loading")) container.innerHTML = notFoundHTML()
                return
            }

            if (!document.querySelector(".detail-loading")) return // route changed mid-fetch

            var repo = repos.find(function (r) { return AITJI.Utils.slugify(r.name) === params.slug })
            if (!repo) {
                container.innerHTML = notFoundHTML()
                return
            }

            container.innerHTML = template(repo)
            var contentEl = document.getElementById("post-content")
            var tocMount = document.getElementById("toc-mount")
            var cleanup = AITJI.TOC.build(contentEl, tocMount)
            return { cleanup: cleanup }
        }
    })
})()
