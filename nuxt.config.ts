import basicSsl from '@vitejs/plugin-basic-ssl'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  experimental: {
    renderJsonPayloads: false
  },
  modules: [
    '@pinia/nuxt',
    "@vueuse/nuxt",
    "@formkit/auto-animate",
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'nuxt-svgo',
    '@nuxtjs/color-mode',
    "nuxt-icon",
    "@nuxtjs/device"
  ],
  colorMode: {
    classSuffix: ''
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
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