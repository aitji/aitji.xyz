# **aitji**.xyz

personal vanilla static site with SSG and client-side SPA navigation, check out [aitji.xyz](https://aitji.xyz)

## toc

- [**aitji**.xyz](#aitjixyz)
  - [toc](#toc)
  - [license](#license)
- [developer](#developer)
  - [install](#install)
  - [production build](#production-build)
  - [development](#development)
    - [http dev](#http-dev)
    - [https dev](#https-dev)

## license

repo protect by [Mozilla Public License Version 2.0](LICENSE)

# developer

## install

```sh
npm install
```

## production build

```sh
npm run build
```

## development

### http dev

```sh
npm run dev_http
```

### https dev

```sh
npm run dev
```

> required folder `key/` in root
```
key/
| aitji-box.echo-hadar.ts.net.crt
| aitji-box.echo-hadar.ts.net.key
| localhost-key.pem
| localhost.pem
```
## privacy and site files

The build generates SSG pages for `/privacy` and `/tos`, validates site metadata, and ships OpenSearch, web manifest, `humans.txt`, `security.txt`, and Android App Links files. Google Analytics is consent-first and can be changed from the privacy page.
