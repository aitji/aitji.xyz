(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    function cardHTML(post) {
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
            '<div class="post-card-tags">' + post.tags.map(function (t) { return '<span class="tag">' + t + "</span>" }).join("") + "</div>" +
            "</a>"
        )
    }

    function template() {
        var posts = (AITJI.BLOGS || []).slice().sort(function (a, b) { return b.date.localeCompare(a.date) })
        var body = posts.length
            ? '<div class="post-list">' + posts.map(cardHTML).join("") + "</div>"
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

    AITJI.Router.registerView("blogs", {
        title: "blogs",
        description: "notes on things aitji built, broke, or thought about for too long.",
        render: function (container) {
            container.innerHTML = template()
        }
    })
})()
