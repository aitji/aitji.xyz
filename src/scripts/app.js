(function () {
    "use strict"

    function boot() {
        AITJI.Widgets.initClock("nav-clock")
        AITJI.Widgets.initDiscordPill("nav-discord-slot")
        AITJI.Router.init()
        AITJI.StatusPill.init()
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot)
    else boot()
})()
