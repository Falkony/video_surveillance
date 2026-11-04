// @ts-check
import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://nnvss.ru',
  trailingSlash: 'never',
  // update-server.sh собирает в отдельную папку, чтобы сайт не падал во время сборки
  outDir: process.env.ASTRO_OUT_DIR || './dist',

  // Все страницы собираются в статический HTML.
  // Node-сервер нужен только для /api/consultation (prerender = false).
  output: 'static',
  adapter: node({ mode: 'standalone' }),

  integrations: [
    icon({
      include: {
        lucide: ['*'],
        'simple-icons': ['telegram']
      }
    }),
    sitemap({
      filter: page => !page.includes('/404')
    })
  ],

  build: {
    // /privacy.html вместо /privacy/index.html — согласовано с trailingSlash: 'never'
    format: 'file',
    // CSS одного лендинга небольшой — инлайним, чтобы не блокировать отрисовку
    inlineStylesheets: 'always'
  },

  prefetch: false,

  vite: {
    plugins: [tailwindcss()]
  }
})
