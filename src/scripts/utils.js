(function () {
    "use strict"

    window.AITJI = window.AITJI || {}
    var LANG_COLOR = Object.freeze({
        TypeScript: "#3178c6",
        JavaScript: "#f1e05a",
        HTML: "#e34c26",
        Astro: "#ff5a03",
        CSS: "#563d7c",
        Python: "#3572a5",
        PHP: "#777bb4",
        PowerShell: "#2a6db1",
        Java: "#b07219",
        Go: "#00ADD8",
        Rust: "#dea584",
        Shell: "#89e051",
        "C++": "#f34b7d",
        C: "#555555",
    })

    function escapeHtml(str) {
        if (str === null || str === undefined) return ""
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
    }

    function slugify(str) {
        return String(str)
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
    }

    function formatDate(iso) {
        try {
            var d = new Date(iso + "T00:00:00")
            if (isNaN(d.getTime())) return iso
            return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
        } catch (e) { return iso }
    }

    function readingTime(text) {
        var words = String(text || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length
        var mins = Math.max(1, (words / 180)).toFixed(2)

        if (mins === '1.00') mins = '>1'
        return `${mins} min read • ${words}`
    }

    function debounce(fn, wait) {
        var t = null
        return function () {
            var args = arguments, ctx = this
            clearTimeout(t)
            t = setTimeout(function () { fn.apply(ctx, args) }, wait)
        }
    }

    function getThaiTime() {
        return new Date().toLocaleTimeString("en-GB", {
            timeZone: "Asia/Bangkok",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
        })
    }

    function iconSpan(name, extraClass) {
        return '<span class="icon' + (extraClass ? " " + extraClass : "") +
            '" style="-webkit-mask-image:url(/img/icons/' + name + '.svg);mask-image:url(/img/icons/' + name + '.svg)" aria-hidden="true"></span>'
    }

    var CATEGORY_COLOR = Object.freeze({
        minecraft: "#62b947", thatako: "#e0607e", web: "#3178c6",
        extension: "#f1e05a", "co-op": "#a371f7", misc: "#9b8890"
    })
    var CATEGORY_LABEL = Object.freeze({
        minecraft: "minecraft", thatako: "thatako school", web: "web",
        extension: "extension", "co-op": "co-contributing", misc: "misc"
    })

    function projectList() {
        return (AITJI.PROJECTS || []).map(function (p, i) { return { p: p, i: i } })
            .sort(function (x, y) { return (!!y.p.featured - !!x.p.featured) || (x.i - y.i) })
            .map(function (x) { return x.p })
    }

    window.AITJI.Data = { projects: projectList }
    window.AITJI.Utils = {
        LANG_COLOR: LANG_COLOR,
        CATEGORY_COLOR: CATEGORY_COLOR,
        CATEGORY_LABEL: CATEGORY_LABEL,
        escapeHtml: escapeHtml,
        slugify: slugify,
        formatDate: formatDate,
        readingTime: readingTime,
        debounce: debounce,
        getThaiTime: getThaiTime,
        iconSpan: iconSpan,
    }
})()
