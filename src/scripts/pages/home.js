(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    const projectLimit = () => window.screen && window.screen.availWidth < 580 ? 4 : 6
    async function rePro() {
        var grid = document.getElementById("home-projects-grid")
        if (!grid) return

        try {
            var repo = await AITJI.Data.fetchRepos()
            grid = document.getElementById("home-projects-grid")
            if (!grid) return
            grid.innerHTML = repo.slice(0, projectLimit()).map(AITJI.ProjectUI.cardHTML).join("")
        } catch (e) {
            grid = document.getElementById("home-projects-grid")
            if (grid && !grid.querySelector(".project-card:not(.skeleton-card)")) {
                grid.innerHTML = '<p class="empty-state">couldn\'t load repos :(</p>'
            }
        }
    }

    function mount() {
        AITJI.Widgets.initClock("hero-clock")
        AITJI.Widgets.initDiscordPill("hero-discord-slot")
        rePro()
    }

    AITJI.Router.registerView("home", {
        title: "aitji",
        description: "self-taught developer. sort of full-stack web dev.",
        render: function (container) {
            container.innerHTML = AITJI.PageTemplates.home([], projectLimit())
            mount()
        },
        mount: mount
    })
})()
