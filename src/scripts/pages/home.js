(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    var INITIAL_SHOW = 6
    if (window.screen.availWidth < 580) INITIAL_SHOW = 4
    function socialsRow() {
        var u = AITJI.Utils
        return [
            { href: "mailto:me@aitji.com", icon: "email", label: "me", ext: false },
            { href: "https://github.com/aitji", icon: "github", label: "github", ext: true },
            { href: "https://www.curseforge.com/members/aitji/projects", icon: "curseforge", label: "curseforge", ext: true },
            { href: "https://www.youtube.com/@aitji-gamer", icon: "youtube", label: "youtube", ext: true },
            { href: "https://aitji.xyz/discord", icon: "discord", label: "discord", ext: true },
            { href: "https://x.com/aitji_", icon: "twitter-x", label: "x", ext: true },
            { href: "https://reddit.com/u/aitji", icon: "reddit", label: "reddit", ext: true },
        ].map((it) => (
            '<a href="' + it.href + '" class="social-btn"' +
            (it.ext ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
            u.iconSpan(it.icon) + "<span>" + it.label + "</span></a>"
        )).join("")
    }

    function friendGrid() {
        var u = AITJI.Utils
        var html = [
            { name: "picker", desc: "pixel human", url: "https://github.com/pickerth-12", icon: "github" },
            { name: "mineners", desc: "math human", url: "https://github.com/minenersGaming", icon: "github" },
            { name: "encyptAES", desc: "network human", url: "https://github.com/encyptAES", icon: "github" },
            { name: "n1gh7shadez", desc: "gaming human", url: "https://n1gh7shadez.vercel.app", icon: "domain" },
            { name: "t4nluxz", desc: "pvp human", url: "https://github.com/t4nluxz7-bot", icon: "github" },
        ].map((f) => (
            '<a href="' + f.url + '" title="' + f.url + '" class="friend-card" target="_blank" rel="noopener noreferrer">' +
            '<span class="friend-name">' + f.name + '</span>' +
            '<span class="friend-desc muted">' + f.desc + '</span>' +
            '<span class="friend-url muted">' + u.iconSpan(f.icon) + "</span>" +
            "</a>"
        )).join("")

        html += '<span class="friend-card"><span class="friend-name">vongwean</span><span class="friend-desc muted">art human</span></span>'
        return html
    }

    function blogsHTML() {
        var posts = (AITJI.BLOGS || []).slice().sort(function (a, b) { return b.date.localeCompare(a.date) }).slice(0, 3)
        if (!posts.length) return '<p class="empty-state">nothing written yet.</p>'

        var u = AITJI.Utils
        return '<div class="blog-preview-list">' + posts.map((p) => (
            '<a href="/blogs/' + p.slug + '" class="blog-preview-card">' +
            '<span class="blog-preview-title">' + u.escapeHtml(p.title) + "</span>" +
            '<span class="blog-preview-date">' + u.formatDate(p.date) + "</span>" +
            "</a>"
        )).join("") + "</div>"
    }

    function template() {
        return (
            '<div class="page">' +
            '<section class="hero container">' +
            '<div class="hero-name-row"><h1 class="hero-name">aitji</h1></div>' +
            '<div class="hero-meta">' +
            '<span id="hero-discord-slot"><span class="discord-loading"></span></span>' +
            '<span class="meta-sep" aria-hidden="true">&middot;</span>' +
            '<span class="clock" id="hero-clock" title="thailand, gmt+7"></span>' +
            '<span class="meta-tz muted">gmt+7</span>' +
            "</div>" +
            '<p class="hero-sub">self-taught developer &amp; (sort of) full-stack web dev.' +
            '<br class="br-hide" />i use lowercase letters.</p>' +
            "</section>" +

            '<section class="section container" id="about">' +
            '<p class="section-label">about</p>' +
            '<div class="card">' +
            "<p>hey, i'm <strong>aitji</strong> a developer who builds things. i like making stuff. " +
            "currently figuring out what to do with this domain.</p>" +
            '<div class="tag-row" style="margin-top:0.85rem">' +
            '<span class="tag">javascript</span><span class="tag">typescript</span><span class="tag">python</span>' +
            '<span class="tag">solidjs</span><span class="tag">vercel</span>' +
            "</div></div>" +
            '<a href="/about" class="section-more">more about me</a>' +
            "</section>" +

            '<section class="section container" id="links">' +
            '<p class="section-label">links</p>' +
            '<div class="socials-row">' + socialsRow() + "</div>" +
            "</section>" +

            '<section class="section container" id="writing">' +
            '<p class="section-label">writing</p>' +
            blogsHTML() +
            '<a href="/blogs" class="section-more">read more posts</a>' +
            "</section>" +

            '<section class="section container" id="projects">' +
            '<p class="section-label">projects</p>' +
            '<div class="projects-container collapsed"><div class="projects-grid" id="home-projects-grid">' +
            AITJI.ProjectUI.skeletonCards(6) +
            "</div></div>" +
            '<a href="/projects" class="section-more">view all projects</a>' +
            "</section>" +

            '<section class="section container" id="friends">' +
            '<p class="section-label">friends</p>' +
            '<div class="friends-grid">' + friendGrid() + "</div>" +
            "</section>" +

            "</div>"
        )
    }

    async function initProject() {
        var grid = document.getElementById("home-projects-grid")
        if (!grid) return

        try {
            var repos = await AITJI.Data.fetchRepos()
            if (!document.getElementById("home-projects-grid")) return // route changed while loading
            grid.innerHTML = repos.slice(0, INITIAL_SHOW).map(AITJI.ProjectUI.cardHTML).join("")
        } catch (e) {
            if (!document.getElementById("home-projects-grid")) return
            grid.innerHTML = '<p class="empty-state">couldn\'t load repos :(</p>'
        }
    }

    AITJI.Router.registerView("home", {
        title: "aitji",
        description: "self-taught developer. sort of full-stack web dev.",
        render: function (container) {
            container.innerHTML = template()
            AITJI.Widgets.initClock("hero-clock")
            AITJI.Widgets.initDiscordPill("hero-discord-slot")
            initProject()
        }
    })
})()
