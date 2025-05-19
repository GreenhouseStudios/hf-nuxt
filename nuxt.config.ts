// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {

        }
      },
      plugins:[
        require("@tailwindcss/line-clamp"),
      ]
    }
  },
  anime: {
    provide: true,
    composables: true,
    autoImport: true,
  },
  build: {
    transpile: ['nuxt-graphql-request'],
  },
  colorMode: {
    classSuffix: '',
    preference: 'light',
    fallback: 'light'
},
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css','~/node_modules/gridstack/dist/gridstack.min.css', '~/node_modules/gridstack/dist/gridstack-all.js'],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error']
    }
  },
  ssr: false,
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
    '@nuxtjs/color-mode',
  ],
  
})