(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    AITJI.Router.registerView("blogs", {
        title: "blogs",
        description: "notes on things aitji built, broke, or thought about for too long.",
        render: function (container) {
            container.innerHTML = AITJI.PageTemplates.blogs()
        }
    })
})()
