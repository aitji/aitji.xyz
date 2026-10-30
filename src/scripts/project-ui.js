(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    function cardHTML(p) {
        var u = AITJI.Utils
        var status = p.status && p.status !== "active"
            ? '<span class="project-stars">' + u.escapeHtml(p.status) + "</span>" : ""
        var cat = '<span class="project-lang"><span class="lang-dot" style="background:' +
            (u.CATEGORY_COLOR[p.category] || "#9b8890") + '"></span>' +
            u.escapeHtml(u.CATEGORY_LABEL[p.category] || p.category || "misc") + "</span>"

        return (
            '<a href="/projects/' + p.slug + '" class="project-card">' +
            '<div class="project-top"><span class="project-name">' + u.escapeHtml(p.name) + "</span>" + status + "</div>" +
            '<p class="project-desc">' + u.escapeHtml(p.description) + "</p>" +
            '<div class="project-bottom">' + cat + "</div>" +
            "</a>"
        )
    }

    window.AITJI.ProjectUI = { cardHTML: cardHTML }
})()
