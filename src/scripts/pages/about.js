(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    AITJI.Router.registerView("about", {
        title: "about",
        description: "more about aitji - background, skills, and what i'm currently working on.",
        render: function (container) {
            container.innerHTML = AITJI.PageTemplates.about()
        }
    })
})()
