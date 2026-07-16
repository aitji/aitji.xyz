(function () {
    "use strict"

    function getThaiTime() {
        return new Date().toLocaleTimeString("en-GB", {
            timeZone: "Asia/Bangkok",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        })
    }

    function initClock() {
        var el = document.getElementById("clock")
        if (!el) return

        const tick = () => el.textContent = getThaiTime()
        tick()
        setInterval(tick, 1000)
    }

    var DOT = Object.freeze({
        online: "#4ade80",
        idle: "#facc15",
        dnd: "#f87171",
        offline: "#6b7280"
    })

    var LABEL = Object.freeze({
        online: "online",
        idle: "idle",
        dnd: "dnd",
        offline: "offline"
    })

    async function initDiscord() {
        var slot = document.getElementById("discord-slot")
        if (!slot) return

        var status = "offline"
        try {
            var res = await fetch("/api/discord")
            if (res.ok) {
                var data = await res.json()
                if (data.status in DOT) status = data.status
            }
        } catch (e) { }

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

    var LANG_COLOR = Object.freeze({
        TypeScript: "#3178c6",
        JavaScript: "#f1e05a",
        HTML: "#e34c26",
        Astro: "#ff5a03",
        CSS: "#563d7c",
        Python: "#3572a5",
        PHP: "#777bb4",
        PowerShell: "#2a6db1",
    })

    var INITIAL_SHOW = 6
    async function fetchRepos() {
        try {
            var r = await fetch("https://cdn.jsdelivr.net/gh/aitji/aitji.xyz@data/repos.json")
            if (r.ok) return r.json()
        } catch (e) {
            console.warn("JSDelivr fetch failed, trying backend:", e)
        }

        try {
            var r2 = await fetch("/api/repos")
            if (r2.ok) return r2.json()
        } catch (e) {
            console.warn("Backend fetch also failed:", e)
        }

        throw new Error("fetch failed -.-;;")
    }

    function buildProjectCard(repo) {
        var card = document.createElement("a")
        card.href = repo.url
        card.target = "_blank"
        card.rel = "noopener noreferrer"
        card.className = "project-card"

        var top = document.createElement("div")
        top.className = "project-top"

        var name = document.createElement("span")
        name.className = "project-name"
        name.textContent = repo.name
        top.appendChild(name)

        if (repo.stars > 0) {
            var stars = document.createElement("span")
            stars.className = "project-stars"
            stars.textContent = "\u2605 " + repo.stars
            top.appendChild(stars)
        }

        card.appendChild(top)
        if (repo.description) {
            var desc = document.createElement("p")
            desc.className = "project-desc"
            desc.textContent = repo.description
            card.appendChild(desc)
        }

        var bottom = document.createElement("div")
        bottom.className = "project-bottom"

        if (repo.language) {
            var lang = document.createElement("span")
            lang.className = "project-lang"

            var dot = document.createElement("span")
            dot.className = "lang-dot"
            dot.style.background = LANG_COLOR[repo.language] || "#9b8890"

            lang.appendChild(dot)
            lang.appendChild(document.createTextNode(repo.language))
            bottom.appendChild(lang)
        }

        card.appendChild(bottom)
        return card
    }

    function sortRepos(data) {
        return data.sort(function (a, b) {
            var starDiff = b.stars - a.stars
            if (starDiff) return starDiff

            var desDiff = b.description.length - a.description.length
            if (desDiff) return desDiff

            return b.name.length - a.name.length
        })
    }

    async function initProjects() {
        var grid = document.getElementById("projects-grid")
        if (!grid) return
        var container = grid.closest(".projects-container")

        var repos = []
        var error = false

        try { repos = sortRepos(await fetchRepos()) }
        catch (err) {
            console.error("Error fetching repos:", err)
            error = true
        }

        grid.innerHTML = ""
        if (error) {
            var placeholder = document.createElement("p")
            placeholder.className = "projects-placeholder"
            placeholder.textContent = "couldn't load repos :("
            grid.appendChild(placeholder)
        } else repos.forEach(function (repo) {
            grid.appendChild(buildProjectCard(repo))
        })

        var expanded = false
        grid.classList.toggle("collapsed", !expanded)

        var hasMore = !error && repos.length > INITIAL_SHOW
        if (hasMore && container) {
            var btn = document.createElement("button")
            btn.className = "show-more-btn"
            btn.textContent = "Show More (" + (repos.length - INITIAL_SHOW) + ")"

            btn.addEventListener("click", function () {
                expanded = !expanded
                grid.classList.toggle("collapsed", !expanded)
                btn.textContent = expanded
                    ? "Show Less"
                    : "Show More (" + (repos.length - INITIAL_SHOW) + ")"
            })

            container.appendChild(btn)
        }
    }

    initClock()
    initDiscord()
    initProjects()
})()
