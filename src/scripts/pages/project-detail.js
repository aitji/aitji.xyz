(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    var current = null
    var find = function (slug) {
        return AITJI.Data.projects().find(function (p) { return p.slug === slug }) || null
    }

    function mount() {
        var content = document.getElementById("post-content")
        var toc = document.getElementById("toc-mount")
        if (!content || !toc) return
        return { cleanup: AITJI.TOC.build(content, toc) }
    }

    AITJI.Router.registerView("projects/detail", {
        title: function (params) { var p = find(params.slug); return p ? p.name : "project not found" },
        description: function (params) {
            var p = find(params.slug)
            return p ? p.description : "project details for " + (params.slug || "aitji") + "."
        },
        render: function (container, params) {
            current = find(params.slug)
            container.innerHTML = AITJI.PageTemplates.projectDetail(current)
            if (current) return mount()
        },
        mount: mount
    })
})()
