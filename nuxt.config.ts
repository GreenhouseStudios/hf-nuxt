// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  anime: {
    provide: true,
    composables: true,
    autoImport: true,
  },
  build: {
    transpile: ['nuxt-graphql-request'],
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error']
    }
  },
  ssr: true,
  vite: {
    plugins: [

    ],
  },
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@hebilicious/vue-query-nuxt',
    '@nuxt/content',
    '@nuxtjs/mdc',
    '@formkit/auto-animate/nuxt',
    '@hypernym/nuxt-anime',
  ],
})