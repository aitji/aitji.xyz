(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    var THRESHOLD = 48
    function init() {
        var pill = document.getElementById("status-pill")
        if (!pill) return

        var ticking = false
        function update() {
            var y = window.scrollY || window.pageYOffset || 0
            pill.classList.toggle("pill-hidden", y > THRESHOLD)
            ticking = false
        }

        function onScroll() {
            if (ticking) return
            ticking = true
            requestAnimationFrame(update)
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        update()
    }

    window.AITJI.StatusPill = { init: init }
})()