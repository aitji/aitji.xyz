(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    AITJI.Router.registerView("notes", {
        title: "notes",
        description: "no thoughts head empty",
        render: function (container) {
            container.innerHTML = AITJI.PageTemplates.notes()
        }
    })
})()
