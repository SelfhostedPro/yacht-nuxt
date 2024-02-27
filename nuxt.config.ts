import basicSsl from '@vitejs/plugin-basic-ssl'
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
    plugins: [basicSsl()]
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
    }
  },
  runtimeConfig: {
    yacht: {}
  },
  typescript: {
    typeCheck: true
  }
})