(function () {
    "use strict"
    window.AITJI = window.AITJI || {}
    var U = null

    function utils() { return U || (U = AITJI.Utils) }
    function skeletonCards(n) {
        var one =
            '<div class="project-card skeleton-card">' +
            '<div class="project-top"><div class="skeleton-title"></div><div class="skeleton-stars"></div></div>' +
            '<div class="skeleton-desc"></div>' +
            '<div class="project-bottom"><div class="skeleton-lang"></div></div>' +
            "</div>"
        return new Array(n).fill(one).join("")
    }

    function cardHTML(repo) {
        var u = utils()
        var slug = u.slugify(repo.name)
        var stars = repo.stars > 0
            ? '<span class="project-stars">\u2605 ' + repo.stars + "</span>"
            : ""
        var desc = repo.description
            ? '<p class="project-desc">' + u.escapeHtml(repo.description) + "</p>"
            : ""
        var lang = repo.language
            ? '<span class="project-lang"><span class="lang-dot" style="background:' +
              (u.LANG_COLOR[repo.language] || "#9b8890") + '"></span>' + u.escapeHtml(repo.language) + "</span>"
            : ""

        return (
            '<a href="/projects/' + slug + '" class="project-card">' +
            '<div class="project-top"><span class="project-name">' + u.escapeHtml(repo.name) + "</span>" + stars + "</div>" +
            desc +
            '<div class="project-bottom">' + lang + "</div>" +
            "</a>"
        )
    }

    window.AITJI.ProjectUI = { skeletonCards: skeletonCards, cardHTML: cardHTML }
})()
