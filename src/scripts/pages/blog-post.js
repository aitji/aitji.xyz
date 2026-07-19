(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    const getSorted = () => (AITJI.BLOGS || []).slice().sort(function (a, b) { return b.date.localeCompare(a.date) })
    const notFoundHTML = () => (
        '<div class="post-page container">' +
        '<a href="/blogs" class="back-link">' + AITJI.Utils.iconSpan("arrow-left") + "<span>back to blogs</span></a>" +
        '<h1 class="page-title">post not found</h1>' +
        '<p class="muted">that one doesn\'t exist, or got moved.</p>' +
        "</div>"
    )

    function navLinkHTML(post, dir) {
        if (!post) return "<span></span>"
        return (
            '<a href="/blogs/' + post.slug + '" class="post-nav-link ' + dir + '">' +
            '<span class="post-nav-dir">' + (dir === "next" ? "next" : "previous") + "</span>" +
            '<span class="post-nav-title">' + AITJI.Utils.escapeHtml(post.title) + "</span>" +
            "</a>"
        )
    }

    function template(post, prev, next) {
        var u = AITJI.Utils
        return (
            '<div class="post-page container">' +
            '<a href="/blogs" class="back-link">' + u.iconSpan("arrow-left") + "<span>back to blogs</span></a>" +

            '<div class="with-toc">' +
            "<div>" +
            '<header class="post-header">' +
            '<h1 class="post-title">' + u.escapeHtml(post.title) + "</h1>" +
            '<div class="post-meta-row">' +
            '<span class="post-meta-item">' + u.iconSpan("calendar") + "<span>" + u.formatDate(post.date) + "</span></span>" +
            '<span class="post-meta-item">' + u.iconSpan("clock") + "<span>" + u.readingTime(post.content) + "</span></span>" +
            "</div>" +
            '<div class="tag-row">' + post.tags.map(function (t) { return '<span class="tag">' + t + "</span>" }).join("") + "</div>" +
            "</header>" +
            '<article class="post-content" id="post-content">' + post.content + "</article>" +
            '<nav class="post-footer-nav">' + navLinkHTML(prev, "prev") + navLinkHTML(next, "next") + "</nav>" +
            "</div>" +
            '<aside class="toc" id="toc-mount"></aside>' +
            "</div>" +
            "</div>"
        )
    }

    AITJI.Router.registerView("blogs/post", {
        title: function (params) {
            var post = (AITJI.BLOGS || []).find(function (p) { return p.slug === params.slug })
            return post ? post.title : "post not found"
        },
        description: "a post from aitji's blog.",
        render: function (container, params) {
            var sorted = getSorted()
            var idx = sorted.findIndex(function (p) { return p.slug === params.slug })

            if (idx === -1) {
                container.innerHTML = notFoundHTML()
                return
            }

            var post = sorted[idx]
            var next = idx > 0 ? sorted[idx - 1] : null
            var prev = idx < sorted.length - 1 ? sorted[idx + 1] : null

            container.innerHTML = template(post, prev, next)

            var contentEl = document.getElementById("post-content")
            var tocMount = document.getElementById("toc-mount")
            var cleanup = AITJI.TOC.build(contentEl, tocMount)

            return { cleanup: cleanup }
        }
    })
})()
