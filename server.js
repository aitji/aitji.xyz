import fs from 'node:fs'
import http from 'node:http'
import https from 'node:https'
import path from 'node:path'
import tls from 'node:tls'
import { spawn } from 'node:child_process'

const USE_HTTPS = process.argv.includes('--https')
const OUT = path.resolve('public')
const PORT = Number(process.env.PORT || (USE_HTTPS ? 443 : 3000))
const HTTP_PORT = Number(process.env.HTTP_PORT || 80)
const ensure = target => fs.mkdirSync(target, { recursive: true })

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf'
}

const LIVERELOAD = `
<!-- [live] local reload helper -->
<script>
(function () {
    var source = new EventSource('/__livereload')
    source.onmessage = function () {
        source.close()
        location.reload()
    }
})()
</script>`

ensure(OUT)

const clients = new Set()
let reloadTimer = null

function broadcastReload() {
    for (const response of clients) {
        try { response.write('data: reload\n\n') }
        catch (e) { clients.delete(response) }
    }
}

fs.watch(OUT, { recursive: true }, function () {
    clearTimeout(reloadTimer)
    reloadTimer = setTimeout(broadcastReload, 180)
})

function safePath(pathname) {
    const candidate = path.resolve(OUT, '.' + pathname)
    if (candidate !== OUT && !candidate.startsWith(OUT + path.sep)) return null
    return candidate
}

function serveHTML(response, file, status = 200) {
    let html = fs.readFileSync(file, 'utf8')
    html = html.includes('</body>') ? html.replace('</body>', LIVERELOAD + '</body>') : html + LIVERELOAD

    response.writeHead(status, {
        'Content-Type': MIME['.html'],
        'Cache-Control': 'no-store'
    })
    response.end(html)
}

function serve404(response) {
    const file = path.join(OUT, '404.html')
    if (fs.existsSync(file)) return serveHTML(response, file, 404)

    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('404 Not Found')
}

function handler(request, response) {
    if (request.url === '/__livereload') {
        response.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive'
        })
        response.write(': connected\n\n')
        clients.add(response)
        request.on('close', function () { clients.delete(response) })
        return
    }

    response.setHeader('X-Powered-By', 'aitji & questionable decisions')

    let pathname
    try {
        pathname = decodeURIComponent(new URL(request.url, 'http://local').pathname)
    } catch (e) {
        return serve404(response)
    }

    if (pathname === '/favicon.ico') pathname = '/img/favicon.ico'

    let file = safePath(pathname)
    if (!file) return serve404(response)

    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
        var indexFile = path.join(file, 'index.html')
        var siblingFile = file + '.html'
        if (fs.existsSync(indexFile)) file = indexFile
        else if (fs.existsSync(siblingFile)) file = siblingFile
    } else if (!fs.existsSync(file) && !path.extname(file)) {
        file += '.html'
    }

    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return serve404(response)

    const extension = path.extname(file).toLowerCase()
    if (extension === '.html') return serveHTML(response, file)

    response.writeHead(200, {
        'Content-Type': MIME[extension] || 'application/octet-stream',
        'Cache-Control': 'no-store'
    })
    fs.createReadStream(file).pipe(response)
}

function loadCert(cert, key) {
    const directory = path.resolve('key')
    const certFile = path.join(directory, cert)
    const keyFile = path.join(directory, key)

    if (!fs.existsSync(certFile) || !fs.existsSync(keyFile)) {
        throw new Error(`SSL cert or key missing:\n  ${certFile}\n  ${keyFile}`)
    }

    return {
        cert: fs.readFileSync(certFile),
        key: fs.readFileSync(keyFile)
    }
}

function listen(server, port, label) {
    server.on('error', function (error) {
        console.error(`[server] ${error.code || 'error'}: ${error.message}`)
        process.exitCode = 1
    })
    server.listen(port, function () {
        console.log(`[server] ${label}`)
    })
}

let server
try {
    if (USE_HTTPS) {
        const localCert = loadCert('localhost.pem', 'localhost-key.pem')
        const tailscaleCert = loadCert(
            'aitji-box.echo-hadar.ts.net.crt',
            'aitji-box.echo-hadar.ts.net.key'
        )
        const contexts = new Map([
            ['localhost', tls.createSecureContext(localCert)],
            ['127.0.0.1', tls.createSecureContext(localCert)],
            ['box.aitji.xyz', tls.createSecureContext(localCert)],
            ['aitji-box.echo-hadar.ts.net', tls.createSecureContext(tailscaleCert)]
        ])

        server = https.createServer({
            ...localCert,
            SNICallback(hostname, callback) {
                callback(null, contexts.get(hostname.toLowerCase()) || contexts.get('localhost'))
            }
        }, handler)

        const redirect = http.createServer(function (request, response) {
            const host = (request.headers.host || 'localhost').replace(/:\d+$/, '')
            response.writeHead(301, { Location: `https://${host}${request.url}` })
            response.end()
        })
        listen(redirect, HTTP_PORT, `redirecting http://localhost:${HTTP_PORT} to HTTPS`)
        listen(server, PORT, `https://localhost${PORT === 443 ? '' : ':' + PORT}`)
    } else {
        server = http.createServer(handler)
        listen(server, PORT, `http://localhost:${PORT}`)
    }
} catch (error) {
    console.error(`[server] ${error.message}`)
    process.exit(1)
}

const builder = spawn(process.execPath, ['build.js', '--watch'], { stdio: 'inherit' })
builder.on('close', function (code) {
    if (code) console.error(`[build] exited with code ${code}`)
})

function shutdown() {
    builder.kill()
    if (server) server.close()
}

process.on('SIGINT', function () {
    shutdown()
    process.exit()
})
process.on('SIGTERM', function () {
    shutdown()
    process.exit()
})
process.on('exit', shutdown)
