(function () {
    "use strict"

    window.AITJI = window.AITJI || {}

    function mountPrivacy() {
        var button = document.getElementById("analytics-toggle")
        var state = document.getElementById("analytics-state")
        var analytics = AITJI.Analytics
        if (!button || !state || !analytics) return

        var signaled = analytics.privacySignal()
        var preference = analytics.preference()

        button.disabled = signaled
        if (signaled) {
            button.textContent = "analytics disabled (by browser)"
            state.textContent = "privacy signal detected"
            return
        }

        if (preference === "on") {
            button.textContent = "disable analytics"
            state.textContent = "analytics is allowed on this browser"
        } else if (preference === "off") {
            button.textContent = "enable analytics"
            state.textContent = "analytics is off on this browser"
        } else {
            button.textContent = "allow analytics"
            state.textContent = "analytics is waiting for your choice"
        }

        button.addEventListener("click", function () {
            if (analytics.preference() === "on") {
                analytics.disable()
                button.textContent = "enable analytics"
                state.textContent = "analytics is off on this browser"
                return
            }

            analytics.enable()
            button.textContent = "disable analytics"
            state.textContent = "analytics is allowed on this browser"
        })
    }

    AITJI.Router.registerView("legal/privacy", {
        title: "privacy",
        description: "how aitji.xyz handles analytics, hosting logs, browser storage, and third-party services.",
        render: function (container) {
            container.innerHTML = AITJI.PageTemplates.privacy()
            mountPrivacy()
        },
        mount: mountPrivacy
    })

    AITJI.Router.registerView("legal/tos", {
        title: "terms",
        description: "small, plain-language terms for using aitji.xyz.",
        render: function (container) {
            container.innerHTML = AITJI.PageTemplates.tos()
        }
    })
})()
