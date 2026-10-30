(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    const projectLimit = () => window.screen && window.screen.availWidth < 580 ? 4 : 6
    function mount() {
        AITJI.Widgets.initClock("hero-clock")
        AITJI.Widgets.initDiscordPill("hero-discord-slot")
    }

    AITJI.Router.registerView("home", {
        title: "aitji",
        description: "self-taught developer. sort of full-stack web dev.",
        render: function (container) {
            container.innerHTML = AITJI.PageTemplates.home(AITJI.Data.projects(), projectLimit())
            mount()
        },
        mount: mount
    })
})()
