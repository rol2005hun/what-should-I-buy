import { fileURLToPath, URL } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  app: {
    head: {
      title: 'Reddit Product Advisor - AI-Powered Product Recommendations',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Discover the best products based on real Reddit discussions. Get AI-powered recommendations using community insights and expert analysis from authentic user experiences.'
        },
        {
          name: 'keywords',
          content: 'reddit product recommendations, AI product advisor, product reviews, community recommendations, reddit analysis, product research, buying guide, consumer insights, product comparison, reddit discussions'
        },
        { name: 'author', content: 'Reddit Product Advisor' },
        { name: 'robots', content: 'index, follow' },
        { name: 'language', content: 'en' },
        { name: 'theme-color', content: '#2563eb' },

        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Reddit Product Advisor - AI-Powered Product Recommendations' },
        {
          property: 'og:description',
          content: 'Get the best product recommendations based on authentic Reddit discussions. AI-powered analysis of community insights to help you make informed purchase decisions.'
        },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:site_name', content: 'Reddit Product Advisor' },
        { property: 'og:locale', content: 'en_US' },

        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Reddit Product Advisor - AI-Powered Product Recommendations' },
        {
          name: 'twitter:description',
          content: 'Discover the best products through AI analysis of Reddit discussions. Get authentic community-driven recommendations for your next purchase.'
        },
        { name: 'twitter:image', content: '/twitter-card.png' },

        { name: 'application-name', content: 'Reddit Product Advisor' },
        { name: 'apple-mobile-web-app-title', content: 'Reddit Product Advisor' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'msapplication-TileColor', content: '#2563eb' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            'name': 'Reddit Product Advisor',
            'description': 'AI-powered product recommendation tool that analyzes Reddit discussions to provide authentic community-driven product suggestions and buying guidance.',
            'applicationCategory': 'ProductivityApplication',
            'operatingSystem': ['Windows', 'macOS', 'Linux', 'Android', 'iOS'],
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD',
              'availability': 'https://schema.org/InStock'
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'Reddit Product Advisor'
            },
            'keywords': 'product recommendations, reddit analysis, AI recommendations, community insights, product research',
            'inLanguage': ['en', 'hu'],
            'isAccessibleForFree': true,
            'featureList': [
              'AI-powered product analysis',
              'Reddit discussion mining',
              'Community-driven recommendations',
              'Multi-language support',
              'Real-time product insights'
            ]
          })
        }
      ]
    }
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n'
  ],

  i18n: {
    locales: [
      { code: 'en', name: 'English', iso: 'en-US', file: 'en.json' },
      { code: 'hu', name: 'Magyar', iso: 'hu-HU', file: 'hu.json' }
    ],
    defaultLocale: 'en',
    langDir: '../app/locales/',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      redirectOn: 'root'
    },
    compilation: {
      strictMessage: false
    }
  },

  css: [
    '@/assets/scss/main.scss'
  ],

  imports: {
    dirs: [
      'shared/utils/**',
      'shared/types/**',
      'app/composables/**',
      'app/stores/**',
      'app/utils/**'
    ]
  },

  nitro: {
    imports: {
      dirs: [
        'shared/utils/**',
        'shared/types/**',
        'app/utils/**'
      ]
    }
  },

  alias: {
    '@': fileURLToPath(new URL('./app', import.meta.url)),
    '@@': fileURLToPath(new URL('.', import.meta.url)),
    '#shared': fileURLToPath(new URL('./shared', import.meta.url))
  },

  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./app', import.meta.url)),
        '@@': fileURLToPath(new URL('.', import.meta.url)),
        '#shared': fileURLToPath(new URL('./shared', import.meta.url))
      }
    },
    define: {
      global: 'globalThis'
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/scss/variables.scss" as *;'
        }
      }
    }
  },

  typescript: {
    typeCheck: false,
    strict: true
  },

  runtimeConfig: {
    openrouterApiKey: process.env.OPENROUTER_API_KEY,
    discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
    public: {
      appName: 'Reddit Product Advisor',
      appVersion: '1.0.0',
      apiUrl: process.env.API_URL || 'http://localhost:3000'
    }
  }
});