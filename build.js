import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import ignore from 'ignore'
import { build } from 'esbuild'
import { minify as minifyHTML } from 'html-minifier-terser'
import { minify as minifyJS } from 'terser'

const ig = ignore()
if (fs.existsSync('.gitignore')) ig.add(fs.readFileSync('.gitignore', 'utf8'))

const SRC = 'src'
const OUT = 'public'
const SITE = 'https://aitji.xyz'
const WATCH = process.argv.includes('--watch')
const ensure = target => fs.mkdirSync(target, { recursive: true })

const headTag = '<script async src="https://www.googletagmanager.com/gtag/js?id=G-SFQWJ1KSXT"></script><script>function gtag(){dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],gtag("js",new Date),gtag("config","G-SFQWJ1KSXT");</script>'
const bodyTag = ''
const bannerText = `
                          ,
   ,-.       _,---._ __  / \\
  /  )    .-'       \`./ /   \\
 (  (   ,'            \`/    /|
  \\  \`-"             \\'\\   / |
   \`.              ,  \\ \\ /  |
    /\`.          ,'-\`----Y   |
   (            ;        |   '
   |  ,-.    ,-'         |  /
   |  | (   |            | /
   )  |  \\  \`.___________|/
   \`--'   \`--'

    aitji.xyz™
    Copyright (c) 2026 aitji
    Source: github.com/aitji/aitji.xyz
`

const banner = {
    html: `<!--${bannerText}-->\n`,
    js: '', // /**${bannerText}*/\n
    css: '' // /*${bannerText}*/\n
}

const minifyJSONFile = async file => {
    try {
        if (!fs.existsSync(file)) throw new Error(`file not found: ${file}`)
        const src = fs.readFileSync(file, 'utf8')
        fs.writeFileSync(file, JSON.stringify(JSON.parse(src)))
    } catch (error) {
        console.error(`[JSON] error processing ${file}: ${error.message}`)
    }
}

const minifyHTMLFile = async file => {
    try {
        let src = fs.readFileSync(file, 'utf8')
        if (!WATCH) {
            if (headTag) src = src.replace('</head>', `${headTag}</head>`)
            if (bodyTag) src = src.replace('</body>', `${bodyTag}</body>`)
        }

        const jsonLd = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i
        const match = src.match(jsonLd)
        if (match) src = src.replace(match[1], JSON.stringify(JSON.parse(match[1])))

        const output = await minifyHTML(src, {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            minifyCSS: true,
            minifyJS: true,
            keepClosingSlash: true,
            html5: true
        })

        fs.writeFileSync(file, file.includes('docs') ? output : banner.html + output)
    } catch (error) {
        console.error(`[HTML] error processing ${file}: ${error.message}`)
    }
}

const minifyJSFile = async (src, out) => {
    try {
        const code = fs.readFileSync(src, 'utf8')
        const r = await minifyJS(code, {
            compress: {
                passes: 3,
                drop_console: true,
                unsafe: true
            },
            mangle: { toplevel: false },
            format: { comments: false }
        })

        let output = r.code || ''
        if (WATCH) output = output.replaceAll('Domain=.aitji.xyz; ', '')
        fs.writeFileSync(out, banner.js + output)
    } catch (error) {
        console.error(`[JS] error processing ${src}: ${error.message}`)
    }
}

const processFile = async (src, out) => {
    ensure(path.dirname(out))

    if (src.endsWith('.html')) {
        fs.copyFileSync(src, out)
        await minifyHTMLFile(out)
        return
    }

    if (src.endsWith('.js')) {
        await minifyJSFile(src, out)
        return
    }

    if (src.endsWith('.css')) {
        try {
            await build({
                entryPoints: [src],
                outfile: out,
                minify: true,
                legalComments: 'none',
                banner: { css: banner.css }
            })
        } catch (error) { console.error(`[CSS] error processing ${src}: ${error.message}`) }
        return
    }

    fs.copyFileSync(src, out)
    if (src.endsWith('.json')) await minifyJSONFile(out)
}

const srcToOut = src => path.join(OUT, path.relative(SRC, src).replace(/\\/g, '/'))
const walk = async dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const src = path.join(dir, entry.name)
        const relative = path.relative(SRC, src).replace(/\\/g, '/')
        if (ig.ignores(relative)) continue

        const output = srcToOut(src)
        if (entry.isDirectory()) {
            ensure(output)
            await walk(src)
            continue
        }

        await processFile(src, output)
    }
}

const copyRoot = (name, output = OUT) => {
    if (!fs.existsSync(name)) return
    fs.cpSync(name, path.join(output, name), { recursive: true })
}

function loadRuntime() {
    const sandbox = {
        console, Date, Intl, URL,
        JSON, Math, Object, Array,
        String, Number, Boolean, RegExp,
        setTimeout, clearTimeout
    }
    sandbox.window = sandbox
    sandbox.screen = { availWidth: 1920 }
    vm.createContext(sandbox)

    const files = [
        'src/scripts/utils.js',
        'src/scripts/project-ui.js',
        'src/data/blogs.js',
        'src/scripts/page-templates.js'
    ]

    for (const file of files) vm.runInContext(
        fs.readFileSync(file, 'utf8'),
        sandbox, { filename: file }
    )

    return sandbox.AITJI
}

const sortRepos = (repos) => repos.slice().sort((a, b) => {
    const starDiff = (b.stars || 0) - (a.stars || 0)
    if (starDiff) return starDiff

    const descriptionDiff = (b.description || '').length - (a.description || '').length
    if (descriptionDiff) return descriptionDiff

    return (b.name || '').length - (a.name || '').length
})

const fetchJSON = async (url, timeout = 8000) => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    try {
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
        return await response.json()
    } finally { clearTimeout(timer) }
}

let repoCache = null
const loadRepos = async (refresh = false) => {
    if (repoCache && !refresh) return repoCache

    const source = process.env.AITJI_OFFLINE === '1' ? [] : [
        process.env.AITJI_REPOS_URL,
        'https://cdn.jsdelivr.net/gh/aitji/aitji.xyz@data/repos.json',
        'https://raw.githubusercontent.com/aitji/aitji.xyz/data/repos.json'
    ].filter(Boolean)

    for (const src of source) {
        try {
            const data = await fetchJSON(src)
            if (Array.isArray(data)) {
                repoCache = sortRepos(data)
                console.log(`[ssg] loaded ${repoCache.length} projects from ${src}`)
                return repoCache
            }
        } catch (error) {
            if (!WATCH) console.warn(`[ssg] project source failed: ${src} (${error.message})`)
        }
    }

    const fallback = path.join(SRC, 'data', 'repos.json')
    try {
        const data = JSON.parse(fs.readFileSync(fallback, 'utf8'))
        repoCache = sortRepos(Array.isArray(data) ? data : [])
    } catch { repoCache = [] }

    console.warn(`[ssg] using local project snapshot (${repoCache.length} projects)`)
    return repoCache
}

// helper?
const escAttribute = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

const routeFile = route => {
    if (route === '/') return path.join(OUT, 'index.html')
    return path.join(OUT, route.slice(1) + '.html')
}

const routeGroup = route => {
    if (route === '/') return 'home'
    return route.split('/').filter(Boolean)[0] || 'home'
}

const routeURL = route => SITE + (route === '/' ? '/' : route)
const replaceTag = (src, pattern, replacement) => {
    if (!pattern.test(src)) throw new Error(`template tag missing: ${pattern}`)
    return src.replace(pattern, replacement)
}

const genDoc = ({ route, title, description, content, type = 'website' }) => {
    const canonical = routeURL(route)
    const fullTitle = title === 'aitji' ? 'aitji' : `${title} - aitji`
    let html = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8')

    html = replaceTag(html, /<title>[\s\S]*?<\/title>/i, `<title>${escAttribute(fullTitle)}</title>`)
    html = replaceTag(html, /<meta name="description" content="[^"]*"\s*\/>/i, `<meta name="description" content="${escAttribute(description)}" />`)
    html = replaceTag(html, /<link rel="canonical" href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${canonical}" />`)
    html = replaceTag(html, /<meta property="og:title" content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${escAttribute(fullTitle)}" />`)
    html = replaceTag(html, /<meta property="og:description" content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${escAttribute(description)}" />`)
    html = replaceTag(html, /<meta property="og:url" content="[^"]*"\s*\/>/i, `<meta property="og:url" content="${canonical}" />`)
    html = replaceTag(html, /<meta property="og:type" content="[^"]*"\s*\/>/i, `<meta property="og:type" content="${type}" />`)
    html = replaceTag(html, /<body>/i, `<body data-prerendered-route="${escAttribute(route)}" data-route="${routeGroup(route)}">`)
    html = replaceTag(html, /<main id="view"><\/main>/i, `<main id="view">${content}</main>`)

    return html
}

const writePage = async (page) => {
    const file = routeFile(page.route)
    ensure(path.dirname(file))
    fs.writeFileSync(file, genDoc(page))
    await minifyHTMLFile(file)
}

const sitemapXML = (pages) => {
    const seen = new Set()
    const entries = pages.filter(page => {
        if (seen.has(page.route)) return false
        seen.add(page.route)
        return true
    }).map(page => {
        const lastmod = page.lastmod ? `\n        <lastmod>${escAttribute(page.lastmod)}</lastmod>` : ''
        return `    <url>\n        <loc>${routeURL(page.route)}</loc>${lastmod}\n    </url>`
    }).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>\n`
}

const genSSG = async (refresh = false) => {
    const AITJI = loadRuntime()
    const template = AITJI.PageTemplates
    const blog = (AITJI.BLOGS || []).slice()
    const repos = await loadRepos(refresh)
    const today = new Date().toISOString().slice(0, 10)

    const pages = [
        {
            route: '/',
            title: 'aitji',
            description: 'self-taught developer. sort of full-stack web dev.',
            content: template.home(repos, 6),
            lastmod: today
        },
        {
            route: '/about',
            title: 'about',
            description: "more about aitji - background, skills, and what i'm currently working on.",
            content: template.about(),
            lastmod: today
        },
        {
            route: '/blogs',
            title: 'blogs',
            description: 'notes on things aitji built, broke, or thought about for too long.',
            content: template.blogs(),
            lastmod: blog.reduce((latest, post) => post.date > latest ? post.date : latest, today)
        },
        {
            route: '/projects',
            title: 'projects',
            description: 'things aitji built, mostly for fun, occasionally on purpose.',
            content: template.projects(repos, 'all'),
            lastmod: today
        }
    ]

    for (const post of blog) pages.push({
        route: `/blogs/${post.slug}`,
        title: post.title,
        description: post.excerpt,
        type: 'article',
        content: template.blogPost(post.slug).html,
        lastmod: post.date
    })

    for (const repo of repos) {
        const slug = AITJI.Utils.slugify(repo.name)
        if (!slug) continue
        pages.push({
            route: `/projects/${slug}`,
            title: repo.name,
            description: repo.description || `project details for ${repo.name}.`,
            content: template.projectDetail(repo),
            lastmod: String(repo.updated || repo.updated_at || repo.pushed_at || today).slice(0, 10)
        })
    }

    for (const page of pages) await writePage(page)

    ensure(path.join(OUT, 'data'))
    fs.writeFileSync(path.join(OUT, 'data', 'repos.json'), JSON.stringify(repos))
    fs.writeFileSync(path.join(OUT, 'sitemap.xml'), sitemapXML(pages))

    console.log(`[ssg] generated ${pages.length} routes`)
}

const startWatch = () => {
    console.log(`[watch] Watching ${SRC}/ for changes...`)
    const timers = new Map()

    fs.watch(SRC, { recursive: true }, async (event, filename) => {
        if (!filename) return

        const relative = filename.replace(/\\/g, '/')
        if (ig.ignores(relative)) return

        const src = path.join(SRC, relative)
        const out = path.join(OUT, relative)
        if (timers.has(src)) clearTimeout(timers.get(src))

        timers.set(src, setTimeout(async () => {
            timers.delete(src)

            if (!fs.existsSync(src)) {
                fs.rmSync(out, { recursive: true, force: true })
                console.log(`[watch] deleted: ${out}`)
                return await genSSG(relative === 'data/repos.json')
            }

            const stat = fs.statSync(src)
            if (stat.isDirectory()) return ensure(out)

            try {
                await processFile(src, out)
                await genSSG(relative === 'data/repos.json')
                console.log(`[watch] ${event === 'rename' ? 'created' : 'updated'}: ${src}`)
            } catch (error) {
                console.error(`[watch] error processing ${src}: ${error.message}`)
            }
        }, 120))
    })
}

const main = async () => {
    if (!WATCH) {
        fs.rmSync(OUT, { recursive: true, force: true })
        ensure(OUT)
    } else ensure(OUT)

    await walk(SRC)
    copyRoot('img')
    await genSSG()

    if (WATCH) startWatch()
    else console.log('Build complete.')
}

main().catch(error => {
    console.error(error)
    process.exitCode = 1
})
