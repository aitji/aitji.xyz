(function () {
    "use strict"

    window.AITJI = window.AITJI || {}

    var MEASUREMENT_ID = "G-SFQWJ1KSXT"
    var STORAGE_KEY = "aitji:analytics"
    var loaded = false
    var memoryPreference = "on"

    function privacySignal() {
        return navigator.globalPrivacyControl === true ||
            navigator.doNotTrack === "1" || navigator.doNotTrack === "yes" ||
            window.doNotTrack === "1" || window.doNotTrack === "yes" ||
            navigator.msDoNotTrack === "1" || navigator.msDoNotTrack === "yes"
    }

    function preference() {
        try { return localStorage.getItem(STORAGE_KEY) || memoryPreference || DEFAULT_PREFERENCE }
        catch { return memoryPreference || DEFAULT_PREFERENCE }
    }

    function savePreference(value) {
        memoryPreference = value
        try { localStorage.setItem(STORAGE_KEY, value) }
        catch (e) { }
    }

    function eraseCookies() {
        document.cookie.split(";").forEach(function (cookie) {
            var name = cookie.split("=")[0].trim()
            if (name !== "_ga" && !name.startsWith("_ga_")) return

            document.cookie = name + "=; Max-Age=0; Path=/; SameSite=Lax"
            document.cookie = name + "=; Max-Age=0; Path=/; Domain=.aitji.xyz; SameSite=Lax"
        })
    }

    function trackPageView() {
        if (!loaded || typeof window.gtag !== "function") return
        if (window["ga-disable-" + MEASUREMENT_ID]) return

        window.gtag("event", "page_view", {
            page_title: document.title,
            page_location: location.href,
            page_path: location.pathname
        })
    }

    function load() {
        if (loaded || privacySignal() || preference() !== "on") return false

        loaded = true
        window["ga-disable-" + MEASUREMENT_ID] = false
        window.dataLayer = window.dataLayer || []
        window.gtag = function () { window.dataLayer.push(arguments) }
        window.gtag("js", new Date())
        window.gtag("set", { allow_ad_personalization_signals: false })
        window.gtag("config", MEASUREMENT_ID, {
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            send_page_view: false
        })
        trackPageView()

        var script = document.createElement("script")
        script.async = true
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID)
        document.head.appendChild(script)
        return true
    }

    function removePrompt() {
        var prompt = document.getElementById("analytics-prompt")
        if (prompt) prompt.remove()
    }

    function enable() {
        if (privacySignal()) return false
        savePreference("on")
        window["ga-disable-" + MEASUREMENT_ID] = false
        removePrompt()
        if (loaded) {
            trackPageView()
            return true
        }
        return load()
    }

    function disable() {
        savePreference("off")
        window["ga-disable-" + MEASUREMENT_ID] = true
        eraseCookies()
        removePrompt()
    }

    function showPrompt() {
        if (location.pathname === "/privacy") return
        if (privacySignal() || preference() || document.getElementById("analytics-prompt")) return

        var prompt = document.createElement("aside")
        prompt.className = "analytics-prompt"
        prompt.id = "analytics-prompt"
        prompt.setAttribute("aria-label", "analytics choice")
        prompt.innerHTML =
            '<p><strong>tiny analytics?</strong> google analytics can count visits after you allow it. no ads or personalization.</p>' +
            '<div class="analytics-prompt-actions">' +
            '<button class="btn btn-accent" type="button" data-analytics="allow">allow</button>' +
            '<button class="btn" type="button" data-analytics="deny">no thanks</button>' +
            '<a href="/privacy">details</a>' +
            '</div>'

        prompt.addEventListener("click", function (event) {
            var action = event.target && event.target.dataset && event.target.dataset.analytics
            if (action === "allow") enable()
            if (action === "deny") disable()
            if (event.target && event.target.closest && event.target.closest('a[href="/privacy"]')) removePrompt()
        })

        document.body.appendChild(prompt)
    }

    window.AITJI.Analytics = {
        enable: enable,
        disable: disable,
        load: load,
        preference: preference,
        privacySignal: privacySignal,
        trackPageView: trackPageView
    }

    load()
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", showPrompt, { once: true })
    else showPrompt()
})()
