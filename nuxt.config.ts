// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Celebrating 100 Years - Greater Hartford Gives',
      meta: [
        { name: 'description', content: 'Celebrating 100 Years' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/cropped-GHG_Favicon-32x32.png' },
        { rel: 'stylesheet', href:'https://use.typekit.net/omh7iec.css' }
      ]
    },
    cdnURL: '/wp-content/themes/i3-hf-centennial/dist/',
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {

        }
      },
      plugins: [
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
  runtimeConfig: {
    public: {
      graphqlUrl: process.env.NUXT_PUBLIC_GRAPHQL_URL || 'https://100years.greaterhartfordgives.org/?graphql'
    }
  },
  css: ['~/assets/css/main.css', '~/node_modules/gridstack/dist/gridstack.min.css', '~/node_modules/gridstack/dist/gridstack-all.js', '/assets/css/wp/wp-block-library.css'],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error']
    }
  },
  ssr: false,
  target: 'static',
  vite: {
    plugins: [

    ],
    server: {
      proxy: {
        './media': {
          target: '/',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/media/, '')
        }
      }
    }
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
    'nuxt-aos',
    'nuxt-gtag'
  ],
  gtag: {
    id: 'G-TEST'
  }
})