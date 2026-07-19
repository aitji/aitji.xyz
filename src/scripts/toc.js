(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    function build(contentEl, tocMount) {
        if (!contentEl || !tocMount) return function () { }

        var headings = Array.prototype.slice.call(contentEl.querySelectorAll("h2, h3"))
        if (!headings.length) {
            tocMount.innerHTML = ""
            return function () { }
        }

        var used = {}
        var items = []
        headings.forEach(function (h) {
            var base = AITJI.Utils.slugify(h.textContent)
            var id = base
            var n = 2
            while (used[id]) { id = base + "-" + n; n++ }
            used[id] = true
            h.id = id
            items.push({ id: id, text: h.textContent, level: h.tagName.toLowerCase() })
        })

        var html = '<div class="toc-inner"><p class="toc-label">on this page</p><ul class="toc-list">'
        items.forEach(function (it) {
            html += '<li><a href="#' + it.id + '" class="' + (it.level === "h3" ? "toc-h3" : "") + '" data-toc-id="' + it.id + '">' +
                AITJI.Utils.escapeHtml(it.text) + "</a></li>"
        })
        html += "</ul></div>"
        tocMount.innerHTML = html

        var links = tocMount.querySelectorAll("a[data-toc-id]")
        var activeId = null
        function setActive(id) {
            if (id === activeId) return
            activeId = id
            links.forEach(function (a) {
                a.classList.toggle("active", a.dataset.tocId === id)
            })
        }

        function lineY() {
            var header = document.querySelector(".site-header")
            return (header ? header.offsetHeight : 0) + 48
        }

        function updateActive() {
            var line = lineY()
            var current = headings[0]
            for (var i = 0; i < headings.length; i++) {
                if (headings[i].getBoundingClientRect().top <= line) current = headings[i]
                else break
            }
            setActive(current.id)
        }

        setActive(items[0].id)
        updateActive()

        var ticking = false
        function onScroll() {
            if (ticking) return
            ticking = true
            requestAnimationFrame(function () { updateActive(); ticking = false })
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)

        return function cleanup() {
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }

    window.AITJI.TOC = { build: build }
})()
