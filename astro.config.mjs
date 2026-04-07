import { defineConfig } from 'astro/config'
import solidJs from '@astrojs/solid-js'

export default defineConfig({
  integrations: [solidJs()],
  site: 'https://aitji.xyz',
  vite: { build: { minify: true } }
})
