(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    var allRepos = []
    var activeLang = "all"

    function renderState() {
        var filters = document.getElementById("lang-filters")
        var count = document.getElementById("repo-count")
        var list = document.getElementById("projects-list")
        if (!filters || !count || !list) return

        filters.innerHTML = AITJI.PageTemplates.projectFiltersHTML(allRepos, activeLang)
        count.textContent = AITJI.PageTemplates.projectCount(allRepos, activeLang)
        list.innerHTML = AITJI.PageTemplates.projectListHTML(allRepos, activeLang)

        filters.querySelectorAll(".filter-chip").forEach(function (button) {
            button.addEventListener("click", function () {
                activeLang = button.dataset.lang
                renderState()
            })
        })
    }

    async function mount() {
        activeLang = "all"

        try {
            allRepos = await AITJI.Data.fetchRepos()
        } catch (e) {
            allRepos = []
            var list = document.getElementById("projects-list")
            if (list && !list.querySelector(".post-card:not(.skeleton-card)")) {
                list.innerHTML = '<p class="empty-state">couldn\'t load repos :(</p>'
            }
            return
        }

        if (!document.getElementById("projects-list")) return
        renderState()
    }

    AITJI.Router.registerView("projects", {
        title: "projects",
        description: "things aitji built, mostly for fun, occasionally on purpose.",
        render: function (container) {
            container.innerHTML = AITJI.PageTemplates.projectsLoading()
            return mount()
        },
        mount: mount
    })
})()
