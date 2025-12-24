// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  mdc: {
    highlight: {
      noApiRoute: false
    }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    prerender: {
      routes: [
        '/'
      ]
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  ssr: true,

  ui: {
    fonts: false
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      htmlAttrs: {
        lang: 'ru'
      }
    }
  },

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://nnvss.ru',
    name: 'Видеонаблюдение в Нижнем Новгороде',
    description: 'Профессиональные системы видеонаблюдения для дома и бизнеса. Установка, настройка и обслуживание под ключ.',
    defaultLocale: 'ru'
  },

  runtimeConfig: {
    telegramBotToken: process.env.NUXT_TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.NUXT_TELEGRAM_CHAT_ID,
    
    public: {
      phone: process.env.NUXT_PUBLIC_PHONE,
      email: process.env.NUXT_PUBLIC_EMAIL,
      telegram: process.env.NUXT_PUBLIC_TELEGRAM,
      siteName: process.env.NUXT_PUBLIC_SITE_NAME,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      yandexMetrikaId: process.env.NUXT_PUBLIC_YANDEX_METRIKA_ID
    }
  },

  robots: {
    allow: '/',
    sitemap: '/sitemap.xml'
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    xsl: false
  }
})
