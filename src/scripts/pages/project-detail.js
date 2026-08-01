(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    var onRepo = null
    function mount() {
        var content = document.getElementById("post-content")
        var toc = document.getElementById("toc-mount")
        if (!content || !toc) return
        return { cleanup: AITJI.TOC.build(content, toc) }
    }

    async function renderProject(container, params) {
        onRepo = null
        container.innerHTML = AITJI.PageTemplates.projectLoading()

        var repos
        try { repos = await AITJI.Data.fetchRepos() }
        catch (e) {
            if (document.querySelector(".detail-loading")) container.innerHTML = AITJI.PageTemplates.projectNotFound()
            return
        }

        if (!document.querySelector(".detail-loading")) return

        var repo = repos.find(function (item) { return AITJI.Utils.slugify(item.name) === params.slug })
        onRepo = repo || null
        container.innerHTML = repo
            ? AITJI.PageTemplates.projectDetail(repo)
            : AITJI.PageTemplates.projectNotFound()

        if (repo) return mount()
    }

    AITJI.Router.registerView("projects/detail", {
        title: function (params) { return onRepo ? onRepo.name : params.slug || "project" },
        description: function (params) {
            if (onRepo && onRepo.description) return onRepo.description
            return "project details for " + (params.slug || "aitji") + "."
        },
        render: renderProject,
        mount: mount
    })
})()
