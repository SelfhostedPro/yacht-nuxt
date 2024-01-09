import basicSsl from '@vitejs/plugin-basic-ssl'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  experimental: {
    renderJsonPayloads: false
  },
  build: {
    transpile: ['vuetify', 'vue-sonner'],
  },
  modules: [
    '@pinia/nuxt', "@vueuse/nuxt", "@formkit/auto-animate", "vuetify-nuxt-module"],
  vuetify: {
    vuetifyOptions: "./vuetify.config.ts",
  },
  vite: {
    plugins: [basicSsl()]
  },
  nitro: {
    experimental: {
      openAPI: true,
      asyncContext: true
    },
    storage: {
      config: {
        driver: 'fsLite',
        base: './config',
      }
    }
  },
  typescript: {
    typeCheck: true
  }
})