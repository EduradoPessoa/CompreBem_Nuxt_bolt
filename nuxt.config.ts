export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    '@vee-validate/nuxt',
    '@nuxtjs/google-fonts'
  ],

  i18n: {
    langDir: 'locales',
    defaultLocale: 'pt-BR',
    locales: [
      { code: 'pt-BR', iso: 'pt-BR', name: 'Português', file: 'pt-BR.json' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.json' },
      { code: 'es', iso: 'es-ES', name: 'Español', file: 'es.json' }
    ],
    strategy: 'prefix_except_default'
  },

  googleFonts: {
    families: {
      Inter: [400, 500, 600, 700],
    },
    display: 'swap'
  },

  colorMode: {
    classSuffix: ''
  },

  app: {
    head: {
      title: 'BuyWell',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Smart Shopping List Management' }
      ]
    }
  },

  runtimeConfig: {
    stripeSecretKey: '',
    public: {
      stripePublicKey: ''
    }
  }
})