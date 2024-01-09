import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import mkcert from 'vite-plugin-mkcert'
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
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    '@pinia/nuxt', "@vueuse/nuxt", "@formkit/auto-animate"],
  vite: {
    https: true,
    plugins: [mkcert({ autoUpgrade: true })],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  nitro: {
    experimental: {
      openAPI: true
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