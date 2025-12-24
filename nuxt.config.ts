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
      routes: ['/'],
      crawlLinks: false,
      failOnError: false
    },
    experimental: {
      wasm: false
    },
    logLevel: 3
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  ssr: false,  // временно отключен для отладки

  ui: {
    fonts: false
  },

  image: {
    quality: 80,
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    }
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
    disallow: ['/api/'],
    sitemap: '/sitemap.xml'
  },

  sitemap: {
    sources: ['/api/__sitemap__/urls'],
    xsl: false,
    cacheMaxAgeSeconds: 3600
  },

  experimental: {
    payloadExtraction: false
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: undefined  // Отключаем ручное разделение
        }
      },
      chunkSizeWarningLimit: 1000
    },
    logLevel: 'warn',
    server: {
      fs: {
        strict: false
      }
    },
    optimizeDeps: {
      include: ['swiper', 'swiper/vue']
    }
  },

  // Отключаем deprecation warnings
  hooks: {
    ready: () => {
      process.removeAllListeners('warning');
    }
  }
})
