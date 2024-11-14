import { resolve } from "pathe"
export default defineNuxtConfig({
    devtools: { enabled: true },
    future: {
        compatibilityVersion: 4,
    },
    build: {
        transpile: ['vue-sonner', 'vuetify'],
      },
    vuetify: {
        vuetifyOptions: resolve('./vuetify.config.ts'),
        moduleOptions: {
            ssrClientHints: {
                reloadOnFirstRequest: true,
                viewportSize: true
            }
        },
    },
    modules: ['vuetify-nuxt-module']
})