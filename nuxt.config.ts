import { resolve } from 'pathe'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: [
    'core',
    'layers/config',
    'layers/auth',
    'layers/notifications',
    'layers/docker'
  ],
  alias: {
    '#core': resolve('core'),
    '#auth': resolve('layers/auth'),
    '#config': resolve('layers/config'),
    '#docker': resolve('layers/docker'),
    '#notifications': resolve('layers/notifications')
  },
  modules: [
    'vuetify-nuxt-module',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vee-validate/nuxt',
    'nuxt-monaco-editor',
    "@formkit/auto-animate",
    '@nuxt/eslint'
  ],

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
      openAPI: true
    },
    openAPI: {
      meta: {
        title: 'Yacht API',
        // description: 'This might become the next big thing.',
        version: '1.0',
      },
    },
    // storage: {
    //   config: {
    //     type: 'fs',
    //     path: process.env.NODE_ENV === 'production' ? '../config' : './config'
    //   },
    //   data: {
    //     type: 'fs',
    //     path: process.env.NODE_ENV === 'production' ? '../data' : './data'
    //   }
    // }
  },
  compatibilityDate: '2024-10-03'
})