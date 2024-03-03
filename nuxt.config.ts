import basicSsl from '@vitejs/plugin-basic-ssl'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true }, // Temporary https://github.com/oven-sh/bun/issues/4743#issuecomment-1874052751
  experimental: {
    renderJsonPayloads: false
  },
  build: {
    transpile: ['vuetify', 'vue-sonner'],
  },
  modules: [
    '@pinia/nuxt',
    "@vueuse/nuxt",
    "@formkit/auto-animate",
    "vuetify-nuxt-module",
    "@vee-validate/nuxt",
    "nuxt-lodash",
  ],
  lodash: {
    prefix: "_",
    upperAfterPrefix: false
  },
  vuetify: {
    vuetifyOptions: "./vuetify.config.ts",
  },
  veeValidate: {
    autoImports: true
  },
  devServer: {
    https: true,
  },
  vite: {
    plugins: [basicSsl()],
    optimizeDeps: {
      exclude: ['better-sqlite3']
    }
  },
  nitro: {
    experimental: {
      openAPI: true,
      asyncContext: true
    },
    alias: {
      "consola/core": "consola/core",
      consola: "consola",
    },
    logging: {
      compressedSizes: true,
    },
    storage: {
      base: {
        driver: 'fsLite',
        base: process.env.CONFIG_PATH || '../config',
      }
    },
    devStorage: {
      base: {
        driver: 'fsLite',
        base: process.env.CONFIG_PATH || './config',
      }
    },
  },
  runtimeConfig: {
    configPath: resolve(fileURLToPath(import.meta.url), '..', process.env.CONFIG_PATH || 'config')
  },
  typescript: {
    typeCheck: true,
  }
})