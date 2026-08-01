(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    const findPost = (slug) => (AITJI.BLOGS || [])
        .find((post) => post.slug === slug)

    function mount() {
        var content = document.getElementById("post-content")
        var toc = document.getElementById("toc-mount")
        if (!content || !toc) return
        return { cleanup: AITJI.TOC.build(content, toc) }
    }

    AITJI.Router.registerView("blogs/post", {
        title: function (params) {
            var post = findPost(params.slug)
            return post ? post.title : "post not found"
        },
        description: function (params) {
            var post = findPost(params.slug)
            return post ? post.excerpt : "a post from aitji's blog."
        },
        type: "article",
        render: function (container, params) {
            container.innerHTML = AITJI.PageTemplates.blogPost(params.slug).html
            return mount()
        },
        mount: mount
    })
})()
