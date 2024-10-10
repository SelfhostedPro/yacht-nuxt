// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['vuetify-nuxt-module', '@pinia/nuxt', '@vueuse/nuxt', '@vee-validate/nuxt', 'nuxt-monaco-editor', "@formkit/auto-animate"],

  build: {
    transpile: ['vue-sonner', 'vuetify'],
  },
  experimental: {
    clientNodeCompat: true
  },
  future: {
    compatibilityVersion: 4,
  },
  typescript: {
    typeCheck: true,
    strict: true
  },

  vuetify: {
    moduleOptions: {
      ssrClientHints: {
        reloadOnFirstRequest: true,
        viewportSize: true
      }
    },
  },
  monacoEditor: {

  },
  nitro: {
    experimental: {
      openAPI: true,
      websocket: true,
    },
    //@ts-expect-error
    openAPI: {
      meta: {
        title: 'Yacht API',
        // description: 'This might become the next big thing.',
        version: '1.0',
      },
    },
  },

  vite: {
    plugins: [],
  },

  compatibilityDate: '2024-10-03'
})