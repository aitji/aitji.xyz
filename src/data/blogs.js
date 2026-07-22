(function () {
    "use strict"
    window.AITJI = window.AITJI || {}

    window.AITJI.BLOGS = [
        {
            slug: "hello-world",
            title: "hello world (again)",
            date: "2026-07-17",
            tags: ["meta", "site"],
            excerpt: "rebuilt the site into an actual spa. here's what changed and why i finally bothered with a router.",
            content: `
<p>okay so i finally sat down and turned this domain into a proper <abbr title="single-page app">spa</abbr>.
before this it was just one long html file with anchor links, <i>which was fine</i>, but
i wanted a real projects page, a real about page, and somewhere to actually write things down.</p>

<h2>what changed</h2>
<p>the site now has a tiny <i>client-side router</i>, and pages that
load without a full refresh. it's <b>still</b> a static site under the hood, there is no backend
rendering, no database, just <code>fetch()</code>, some <code>history.pushState</code>,
and a build script that minifies everything before it ships.</p>

<h2>why bother</h2>
<p>mostly because i wanted somewhere to write short notes without it being a whole
production. blogs, projects, and an about page that isn't crammed into a single
screen felt like the right amount of structure.</p>

<h2>what's next</h2>
<p>probably more posts, more projects as i finish them?</p>`
        },
        {
            slug: "why-lowercase",
            title: "why everything here is lowercase",
            date: "2026-07-18",
            tags: ["random"],
            excerpt: "a short, slightly unnecessary explanation for a very small design choice.",
            content: `
<p>people ask about this more than i expected. the whole site &mdash; copy, commit
messages, most of my usernames &mdash; is lowercase on purpose.</p>

<h2>the actual reason</h2>
<p>honestly it just reads calmer. capital letters at the start of every sentence felt like
shouting for no reason on a personal site that's mostly just me talking about projects.</p>

<h2>the rules i actually follow</h2>
<p>proper nouns still get capitalized when it'd be confusing not to (like <strong>GitHub</strong>
or <strong>Discord</strong>), and code blocks are exactly whatever the code actually is.
everything else stays lowercase.</p>`
        },
        {
            slug: "no-framework-router",
            title: "building a router with no framework",
            date: "2026-07-19",
            tags: ["dev", "javascript"],
            excerpt: "wiring up client-side routing without react, without a bundler, and without regret.",
            content: `
<p>i didn't want to pull in a framework just to swap some content in and out of a div.
here's roughly how the router on this site works.</p>

<h2>the routes file</h2>
<p>navigation is driven by a small <code>routes.json</code> file that lists each top-level
page <i>title, slug, and which view module renders it</i>. dynamic sections like
<code>/blogs/*</code> and <code>/projects/*</code> use a wildcard slug so a single view can
handle every post or project without listing each one by hand.</p>

<h2>intercepting navigation</h2>
<p>every click on an internal link gets intercepted, <code>preventDefault()</code> is called,
and <code>history.pushState</code> swaps the url without a reload. a <code>popstate</code>
listener handles the browser's back and forward buttons the same way. classic</p>

<h3>matching dynamic paths</h3>
<p>for something like <code>/projects/aitji-xyz</code>, the router strips the known prefix
and hands whatever's left to the view as a parameter. no regex gymnastics, just
<code>split('/')</code> and a bit of patience.</p>

<h2>view transitions</h2>
<p>i looked at the native view transitions api and decided against it. support is
still inconsistent in firefox, and i wanted this to feel the same everywhere. instead
there's a small css fade/slide handled with plain class toggles, which works identically
in chrome, firefox, and safari.</p>

<h2>keeping it honest</h2>
<p>no virtual dom, no diffing, no state library. each view is just a function that returns
a string of html. it's not going to scale to a huge app, but for a personal site it's
plenty, and i can read the entire router in about a minute.</p>`
        },
        {
            slug: "7tv-anywhere",
            title: "hello 7tv-anywhere",
            date: "2026-07-22",
            tags: ["dev", "7tv"],
            excerpt: "i making 7tv-anywhere because it kinda funny",
            content: `
<p>i kinda use 7tv emotes outside of twitch chat, but :SCHIZO: and imagine all emote in my head not that ideal
so i made <a target="_blank" rel="noopener" href="https://github.com/aitji/7tv-anywhere">7tv anywhere</a>,
a <i>"small"</i> firefox extension that brings 7tv emotes into text fields and rendered text across the web</p>

<h2>what it actually does</h2>
<p>the extension can render emote names as images on supported pages and show autocomplete suggestions while typing.
channels and emote sets can be added through the popup, so it's not locked to one default community or one list of emotes.</p>

<h2>why i made it</h2>
<p>mostly because the idea was <i>funny</i>. seeing an emote such as :classic: appear somewhere
completely unrelated to twitch is unnecessary, but in a funny way.</p>

<p>it also became a good excuse to experiment with browser extension APIs,
editable elements, autocomplete positioning, and websites that invent
increasingly creative ways to implement a text box :catDespair:</p>

<h2>slightly difficult parts</h2>
<p>normal inputs and textareas are simple enough, but contenteditable editors and custom website interfaces are
less cooperative. some pages need special handling, while others are disabled by default because rendering or autocomplete
would break their editor.</p>

<h2>getting it onto firefox</h2>

<p>once the current version is approved, it should be available from <a target="_blank" rel="noopener" href="https://addons.mozilla.org/en-US/firefox/addon/7tv-anywhere">the firefox add-ons page</a></p>`
        }
    ]
})()
