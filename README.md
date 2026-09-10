# **aitji**.xyz

personal vanilla static site with SSG and client-side SPA navigation, check out [aitji.xyz](https://aitji.xyz)

## toc

- [**aitji**.xyz](#aitjixyz)
  - [toc](#toc)
  - [tech stack](#tech-stack)
  - [license](#license)
- [developer](#developer)
  - [scripts](#scripts)

## tech stack

| area | tool |
| --- | --- |
| language | vanilla JavaScript (site) + TypeScript (serverless functions) |
| routing | hand-rolled client-side SPA router, no framework |
| build | [esbuild](https://esbuild.github.io/), [terser](https://terser.org/), [html-minifier-terser](https://github.com/terser/html-minifier-terser) |
| hosting | [Vercel](https://vercel.com/) |
| local dev | custom Node.js http/https server (`server.js`) |

## license

repo protect by [Mozilla Public License Version 2.0](LICENSE)

# developer

## scripts

| command | what it does |
| --- | --- |
| `npm install` | install dependencies |
| `npm run build` | build `src/` to `public/` via `build.js` |
| `npm run dev_http` | run the local dev server over http |
| `npm run dev` | run the local dev server over https, needs `key/` *(see below)* |
| `npm run tls` | generate local + tailscale certs into `key/` *(see below)*|

![replace tailscale](https://notice-badges.atomictyler.dev/api/notice?type=info&title=replace+tailscale&message=%60npm+run+dev%60+requires+a+%60key%2F%60+folder+in+the+project+root%0A%60%60%60%0Akey%2F%0A%E2%94%9C+aitji-box.echo-hadar.ts.net.crt%0A%E2%94%9C+aitji-box.echo-hadar.ts.net.key%0A%E2%94%9C+localhost-key.pem%0A%E2%94%94+localhost.pem%0A%60%60%60%0A%3E+%60*.echo-hadar.ts.net%60+is+my+tailscale%2C+replace+with+your+own%21&icon=terminal&width=640&radius=8)
