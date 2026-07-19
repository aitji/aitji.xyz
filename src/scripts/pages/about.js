(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    const SKILLS = [
        {
            label: "languages",
            tags: ["javascript", "typescript", "python", "php", "html", "css", "json", "yaml"]
        },
        {
            label: "frameworks",
            tags: ["astro", "solidjs", "react", "vue", "next.js", "nuxt", "express", "fastify"]
        },
        {
            label: "ui",
            tags: ["tailwind css", "bootstrap", "material ui",]
        },
        {
            label: "developer tools",
            tags: ["git", "github", "bash", "powershell", "vite", "webpack", "rollup*", "eslint", "prettier", "ffmpeg", "aria2c"]
        },
        {
            label: "platforms",
            tags: ["vercel", "cloudflare", "github pages", "firebase"]
        },
        {
            label: "apis",
            tags: ["serverless", "workers", "rest", "websocket", "server send event"]
        },
        {
            label: "devops",
            tags: ["github actions", "nginx"]
        },
        {
            label: "operating systems",
            tags: ["windows", "linux-nixos"]
        }
    ]

    function skillsHTML() {
        return SKILLS.map(function (g) {
            return (
                '<div class="skill-group">' +
                '<p class="skill-group-label">' + g.label + "</p>" +
                '<div class="tag-row">' + g.tags.map(function (t) { return '<span class="tag">' + t + "</span>" }).join("") + "</div>" +
                "</div>"
            )
        }).join("")
    }

    function template() {
        var u = AITJI.Utils
        return (
            '<div class="about-page container">' +
            '<h1 class="page-title">about me</h1>' +
            '<p class="page-lede">the longer version of the one-liner on the home page.</p>' +
            '<section class="section">' +
            '<div class="bio">' +
            "<p>i'm <strong>aitji</strong>, a self-taught developer who enjoys building things for the web. i mostly work with javascript and typescript, and i care a lot about writing code that's simple, readable, and fast, " +
            "outside of programming, i'm student public relations &amp; ex-council. i also have a terrible short-term memory.</p>" +
            "<p>i prefer lowercase letters, clean interfaces, and i'm always trying to improve a little thing.</p>" +
            "</div></section>" +

            '<section class="section">' +
            '<p class="section-label">quick facts</p>' +
            '<div class="facts-grid">' +
            '<div class="fact-card"><p class="fact-label">based in</p><p class="fact-value">thailand</p></div>' +
            '<div class="fact-card"><p class="fact-label">timezone</p><p class="fact-value">gmt+7</p></div>' +
            '<div class="fact-card"><p class="fact-label">focus</p><p class="fact-value">tools &amp; web</p></div>' +
            '<div class="fact-card"><p class="fact-label">style</p><p class="fact-value">lowercase, always</p></div>' +
            "</div></section>" +

            /*'<section class="section">' +
            '<p class="section-label">now</p>' +
            '<div class="card now-card">' +
            "<p>haha new page:</p>" +
            '<a href="/blogs/no-framework-router">blog</a>.</p>' +
            "</div></section>" +*/

            '<section class="section">' +
            '<p class="section-label">skills</p>' +
            skillsHTML() +
            "</section>" +

            '<section class="section">' +
            '<p class="section-label">get in touch</p>' +
            '<div class="socials-row">' +
            '<a href="mailto:me@aitji.com" class="social-btn">' + u.iconSpan("email") + "<span>me</span></a>" +
            '<a href="https://github.com/aitji" class="social-btn" target="_blank" rel="noopener noreferrer">' + u.iconSpan("github") + "<span>github</span></a>" +
            '<a href="https://aitji.xyz/discord" class="social-btn" target="_blank" rel="noopener noreferrer">' + u.iconSpan("discord") + "<span>discord</span></a>" +
            "</div></section>" +
            "</div>"
        )
    }

    AITJI.Router.registerView("about", {
        title: "about",
        description: "more about aitji \u2014 background, skills, and what i'm currently working on.",
        render: function (container) { container.innerHTML = template() }
    })
})()
