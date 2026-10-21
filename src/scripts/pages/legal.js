(function () {
    "use strict"

    window.AITJI = window.AITJI || {}

    AITJI.Router.registerView("legal/privacy", {
        title: "privacy",
        description: "how aitji.xyz handles hosting logs, browser storage, and third-party services.",
        render: function (container) {
            container.innerHTML = AITJI.PageTemplates.privacy()
        }
    })

    AITJI.Router.registerView("legal/tos", {
        title: "terms",
        description: "small, plain-language terms for using aitji.xyz.",
        render: function (container) {
            container.innerHTML = AITJI.PageTemplates.tos()
        }
    })
})()
