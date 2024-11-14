import { createResolver } from '@nuxt/kit'

const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
    devtools: { enabled: true },
    future: {
        compatibilityVersion: 4,
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
        componentDir: resolve('./app/components/ui')
    },
    modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/color-mode'],
    css: [
        resolve('./app/assets/css/tailwind.css'),
        // resolve('./app/assets/css/theme.css'),
    ]
})