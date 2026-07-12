const CACHE_NAME = 'aitji-cache-v1'
const PRECACHE_ASSETS = [
    '/',
    '/index.html',

    '/android-icon-36x36.png',
    '/android-icon-48x48.png',
    '/android-icon-72x72.png',
    '/android-icon-96x96.png',
    '/android-icon-144x144.png',
    '/android-icon-192x192.png',
    '/apple-icon-60x60.png',
    '/apple-icon-72x72.png',
    '/apple-icon-76x76.png',
    '/apple-icon-114x114.png',
    '/apple-icon-120x120.png',
    '/apple-icon-144x144.png',
    '/apple-icon-152x152.png',
    '/apple-icon-180x180.png',
    '/apple-icon-precomposed.png',
    '/apple-icon.png',
    '/browserconfig.xml',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
    '/favicon-96x96.png',
    '/favicon.ico',
    '/manifest.json',
    '/ms-icon-70x70.png',
    '/ms-icon-144x144.png',
    '/ms-icon-150x150.png',
    '/ms-icon-310x310.png'
]

const putCache = async (request, response) => {
    if (!response.ok) return response

    const cache = await caches.open(CACHE_NAME)
    cache.put(request, response.clone())

    return response
}

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME)

        await Promise.allSettled(
            PRECACHE_ASSETS.map(asset => cache.add(asset))
        )

        await self.skipWaiting()
    })())
})

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const names = await caches.keys()

        await Promise.all(
            names
                .filter(name => name !== CACHE_NAME)
                .map(name => caches.delete(name))
        )

        await self.clients.claim()
    })())
})

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') return
    const url = new URL(event.request.url)

    // network
    if (
        url.pathname.startsWith('/api/') ||
        url.hostname.includes('jsdelivr.net')
    ) {
        event.respondWith((async () => {
            try {
                const res = await fetch(event.request)

                if (!res.ok) throw new Error()

                return putCache(event.request, res)
            } catch {
                return (
                    await caches.match(event.request)
                ) || Response.error()
            }
        })())

        return
    }

    // cache
    if (url.hostname.includes('api.iconify.design')) {
        event.respondWith((async () => {
            const cached = await caches.match(event.request)
            if (cached) return cached

            const res = await fetch(event.request)
            return putCache(event.request, res)
        })())

        return
    }

    // stale
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME)
        const cached = await cache.match(event.request)

        const network = fetch(event.request)
            .then(res => putCache(event.request, res))
            .catch(() =>
                event.request.mode === 'navigate'
                    ? caches.match('/index.html')
                    : undefined
            )

        return cached || network
    })())
})