// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  build: {
    transpile: ['nuxt-graphql-request'],
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
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
  ],
})