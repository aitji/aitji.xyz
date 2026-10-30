(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    var activeCat = "all"

    function renderState() {
        var list = AITJI.Data.projects()
        var filters = document.getElementById("lang-filters")
        var count = document.getElementById("repo-count")
        var box = document.getElementById("projects-list")
        if (!filters || !count || !box) return

        filters.innerHTML = AITJI.PageTemplates.projectFiltersHTML(list, activeCat)
        count.textContent = AITJI.PageTemplates.projectCount(list, activeCat)
        box.innerHTML = AITJI.PageTemplates.projectListHTML(list, activeCat)

        filters.querySelectorAll(".filter-chip").forEach(function (button) {
            button.addEventListener("click", function () {
                activeCat = button.dataset.lang
                renderState()
            })
        })
    }

    function mount() {
        activeCat = "all"
        renderState()
    }

    AITJI.Router.registerView("projects", {
        title: "projects",
        description: "things aitji built, mostly for fun, occasionally on purpose.",
        render: function (container) {
            container.innerHTML = AITJI.PageTemplates.projects(AITJI.Data.projects(), "all")
            mount()
        },
        mount: mount
    })
})()
