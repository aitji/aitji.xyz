(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    var DOT = Object.freeze({ online: "#4ade80", idle: "#facc15", dnd: "#f87171", offline: "#6b7280" })
    var LABEL = Object.freeze({ online: "online", idle: "idle", dnd: "dnd", offline: "offline" })

    var clockTimers = {}
    function initClock(elId) {
        var el = document.getElementById(elId)
        if (!el) return

        if (clockTimers[elId]) clearInterval(clockTimers[elId])

        var tick = function () { el.textContent = AITJI.Utils.getThaiTime() }
        tick()
        clockTimers[elId] = setInterval(tick, 1000)
    }

    var discordPromise = null
    var DISCORD_TTL = 60 * 1000
    function fetchDiscordStatus() {
        if (discordPromise) return discordPromise

        discordPromise = (async function () {
            var status = "offline"
            try {
                var res = await fetch("/api/discord")
                if (res.ok) {
                    var data = await res.json()
                    if (data.status in DOT) status = data.status
                }
            } catch { }
            setTimeout(function () { discordPromise = null }, DISCORD_TTL)
            return status
        })()

        return discordPromise
    }

    async function initDiscordPill(containerId) {
        var slot = document.getElementById(containerId)
        if (!slot) return

        var status = await fetchDiscordStatus()
        if (!document.getElementById(containerId)) return

        var pill = document.createElement("span")
        pill.className = "discord-pill"

        var dot = document.createElement("span")
        dot.className = "discord-dot"
        dot.style.background = DOT[status]
        dot.setAttribute("aria-hidden", "true")

        var label = document.createElement("span")
        label.className = "discord-label"
        label.textContent = LABEL[status]

        pill.appendChild(dot)
        pill.appendChild(label)

        slot.innerHTML = ""
        slot.appendChild(pill)
    }

    window.AITJI.Widgets = { initClock: initClock, initDiscordPill: initDiscordPill }
})()
