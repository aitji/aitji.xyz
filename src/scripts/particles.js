(function () {
    var container = document.getElementById("particles");
    var COLORS = ["#c8496a", "#e0607e", "#f0a0b8"];

    function burst(x, y) { for (var i = 0; i < 10; i++) spawn(x, y); }
    function spawn(x, y) {
        var el = document.createElement("div");
        var size = 4 + Math.random() * 5;
        var angle = Math.random() * Math.PI * 2;
        var dist = 35 + Math.random() * 55;
        var dx = Math.cos(angle) * dist;
        var dy = Math.sin(angle) * dist - 10;
        var dur = 450 + Math.random() * 350;
        var color = COLORS[Math.floor(Math.random() * COLORS.length)];

        el.style.cssText = [
            "position:fixed",
            "pointer-events:none",
            "z-index:9999",
            "border-radius:50%",
            "left:" + x + "px",
            "top:" + y + "px",
            "width:" + size + "px",
            "height:" + size + "px",
            "background:" + color,
            "transform:translate(-50%,-50%)",
        ].join(";");

        container.appendChild(el);

        el.animate(
            [
                { transform: "translate(-50%,-50%) translate(0,0)", opacity: 1 },
                { transform: "translate(-50%,-50%) translate(" + dx + "px," + dy + "px)", opacity: 0, },
            ],
            { duration: dur, easing: "cubic-bezier(0,.9,.57,1)" },
        ).onfinish = function () {
            el.remove();
        };
    }

    document.addEventListener("click", function (e) {
        burst(e.clientX, e.clientY);
    });
})();