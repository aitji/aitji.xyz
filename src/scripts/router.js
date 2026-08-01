(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    var views = {}
    var topRoutes = []
    var matchList = []
    var viewEl = null
    var navTabsEl = null
    var navIndicatorEl = null
    var currentCleanup = null
    var lastPathname = null

    function registerView(path, def) { views[path] = def }
    function flatten(routes, list) {
        list = list || []
        for (var i = 0; i < routes.length; i++) {
            var r = routes[i]
            list.push({ slug: r.slug, path: r.path, title: r.title })
            if (r.pages && r.pages.length) flatten(r.pages, list)
        }
        return list
    }

    function normalize(pathname) {
        if (pathname.length > 1 && pathname.endsWith("/")) pathname = pathname.slice(0, -1)
        return pathname || "/"
    }

    function matchRoute(pathname) {
        pathname = normalize(pathname)

        for (var i = 0; i < matchList.length; i++) {
            var r = matchList[i]
            if (r.slug.endsWith("/*")) continue
            if (normalize(r.slug) === pathname) return { view: r.path, params: {} }
        }

        for (var j = 0; j < matchList.length; j++) {
            var w = matchList[j]
            if (!w.slug.endsWith("/*")) continue
            var prefix = w.slug.slice(0, -2)
            if (pathname === prefix) return { view: w.path, params: { slug: "" } }
            if (pathname.startsWith(prefix + "/")) {
                return { view: w.path, params: { slug: pathname.slice(prefix.length + 1) } }
            }
        }

        return null
    }

    function topSegmentSlug(pathname) {
        pathname = normalize(pathname)
        if (pathname === "/") return "/"
        return "/" + pathname.split("/")[1]
    }

    function setAtt(selector, name, value) {
        var element = document.querySelector(selector)
        if (element && value) element.setAttribute(name, value)
    }

    function setMeta(meta) {
        if (!meta) return

        var title = meta.title || "aitji"
        var fullTitle = title === "aitji" ? "aitji" : title + " - aitji"
        var description = meta.description || "self-taught developer. sort of full-stack web dev."
        var canonical = new URL(meta.pathname || location.pathname, location.origin).href

        document.title = fullTitle
        setAtt('meta[name="description"]', "content", description)
        setAtt('link[rel="canonical"]', "href", canonical)
        setAtt('meta[property="og:title"]', "content", fullTitle)
        setAtt('meta[property="og:description"]', "content", description)
        setAtt('meta[property="og:url"]', "content", canonical)
        setAtt('meta[property="og:type"]', "content", meta.type || "website")
    }

    function resolveMetaValue(value, params) {
        return typeof value === "function" ? value(params) : value
    }

    function applyViewMeta(def, params, pathname) {
        setMeta({
            title: resolveMetaValue(def.title, params),
            description: resolveMetaValue(def.description, params),
            type: resolveMetaValue(def.type, params),
            pathname: pathname
        })
    }

    function updateActiveTab(pathname) {
        var seg = topSegmentSlug(pathname)
        var buttons = navTabsEl ? navTabsEl.querySelectorAll(".tab-btn") : []
        var activeBtn = null

        buttons.forEach(function (btn) {
            var isActive = btn.dataset.slug === seg
            btn.classList.toggle("active", isActive)
            if (isActive) activeBtn = btn
        })

        if (activeBtn && navIndicatorEl) {
            navIndicatorEl.style.left = activeBtn.offsetLeft + "px"
            navIndicatorEl.style.width = activeBtn.offsetWidth + "px"
        }

        document.body.setAttribute("data-route", seg === "/" ? "home" : seg.slice(1))
    }

    function syncHeaderHeight() {
        var header = document.querySelector(".site-header")
        if (header) document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px")
    }

    function renderNav() {
        if (!navTabsEl) return
        navTabsEl.innerHTML = ""

        topRoutes.forEach(function (r) {
            var a = document.createElement("a")
            a.href = r.slug
            a.className = "tab-btn"
            a.dataset.slug = r.slug
            a.textContent = r.title
            navTabsEl.appendChild(a)
        })

        var indicator = document.createElement("span")
        indicator.className = "tab-indicator"
        indicator.setAttribute("aria-hidden", "true")
        navTabsEl.appendChild(indicator)
        navIndicatorEl = indicator
    }

    function scrollForNav(hash, isPopState) {
        if (hash) {
            var target = document.getElementById(hash.slice(1))
            if (target) return requestAnimationFrame(function () {
                target.scrollIntoView({ behavior: "smooth", block: "start" })
            })
        }
        if (!isPopState) window.scrollTo(0, 0)
    }

    async function useResult(result) {
        if (result && typeof result.then === "function") result = await result
        if (result && typeof result.cleanup === "function") currentCleanup = result.cleanup
    }

    async function render(pathname, opts) {
        opts = opts || {}
        var hash = opts.hash || ""
        var match = matchRoute(pathname)

        if (typeof currentCleanup === "function") {
            try { currentCleanup() }
            catch (e) { }
            currentCleanup = null
        }

        var def = match && views[match.view]
        if (!def) {
            viewEl.innerHTML =
                '<div class="container" style="padding-top:4rem;text-align:center">' +
                '<p class="page-title">nothing here</p>' +
                '<p class="muted" style="margin-top:0.5rem">that page doesn\'t exist.</p>' +
                '<a href="/" class="btn btn-accent" style="margin-top:1.5rem;display:inline-flex">back home</a>' +
                "</div>"
            setMeta({ title: "404", description: "page not found", pathname: pathname })
            updateActiveTab(pathname)
            lastPathname = normalize(pathname)
            return
        }

        var prerenderedRoute = document.body.dataset.prerenderedRoute
        var usePrerendered = opts.initial && prerenderedRoute && normalize(prerenderedRoute) === normalize(pathname)

        if (usePrerendered) {
            if (typeof def.mount === "function") await useResult(def.mount(viewEl, match.params))
            updateActiveTab(pathname)
            lastPathname = normalize(pathname)
            scrollForNav(hash, !!opts.isPopState)
            return
        }

        if (!opts.initial) {
            viewEl.classList.remove("view-enter")
            viewEl.classList.add("view-exit")
            await new Promise(function (resolve) { setTimeout(resolve, 110) })
        }

        viewEl.innerHTML = ""
        await useResult(def.render(viewEl, match.params))
        applyViewMeta(def, match.params, pathname)
        updateActiveTab(pathname)
        lastPathname = normalize(pathname)

        viewEl.classList.remove("view-exit")
        viewEl.classList.add("view-enter")
        viewEl.addEventListener("animationend", function handler() {
            viewEl.classList.remove("view-enter")
            viewEl.removeEventListener("animationend", handler)
        })
        scrollForNav(hash, !!opts.isPopState)
    }

    function isInternalLink(a) {
        if (!a || !a.href) return false
        if (a.target && a.target !== "" && a.target !== "_self") return false
        if (a.hasAttribute("download")) return false
        if (a.dataset.external !== undefined) return false

        var url
        try { url = new URL(a.href, location.href) }
        catch { return false }
        return url.origin === location.origin
    }

    function navigate(path, opts) {
        opts = opts || {}
        var url = new URL(path, location.href)
        if (!opts.replace) history.pushState({}, "", url)
        else history.replaceState({}, "", url)
        render(url.pathname, { hash: url.hash })
    }

    function onClick(e) {
        if (e.defaultPrevented || e.button !== 0) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

        var a = e.target.closest && e.target.closest("a")
        if (!isInternalLink(a)) return

        var url = new URL(a.href, location.href)
        if (url.pathname === location.pathname && url.hash) return

        e.preventDefault()
        navigate(url.pathname + url.search + url.hash)
    }

    async function init() {
        viewEl = document.getElementById("view")
        navTabsEl = document.getElementById("tab-bar")
        if (!viewEl) return

        try {
            var res = await fetch("/routes.json")
            var data = await res.json()
            topRoutes = data.routes || []
            matchList = flatten(topRoutes)
        } catch (e) {
            topRoutes = [
                { title: "home", slug: "/", path: "home" },
                { title: "about", slug: "/about", path: "about" },
                { title: "blogs", slug: "/blogs", path: "blogs" },
                { title: "projects", slug: "/projects", path: "projects" }
            ]
            matchList = topRoutes.slice()
        }

        renderNav()
        syncHeaderHeight()
        document.addEventListener("click", onClick)
        window.addEventListener("popstate", function () {
            if (normalize(location.pathname) === lastPathname) return scrollForNav(location.hash, true)
            render(location.pathname, { hash: location.hash, isPopState: true })
        })
        window.addEventListener("resize", AITJI.Utils.debounce(function () {
            updateActiveTab(location.pathname)
            syncHeaderHeight()
        }, 150))

        await render(location.pathname, { hash: location.hash, initial: true })
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHeaderHeight)
    }

    window.AITJI.Router = {
        registerView: registerView,
        navigate: navigate,
        setMeta: setMeta,
        init: init
    }
})()
