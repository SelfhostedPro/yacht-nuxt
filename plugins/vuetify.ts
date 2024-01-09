import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import type { ThemeDefinition } from 'vuetify'

const yachtDarkTheme: ThemeDefinition = {
    dark: true,
    colors: {
        primary: "#47978F",
        secondary: "#424242",
        background: "#000000",
        tabs: "#1E1E1E",
        foreground: "#323232"
    },
}

export default defineNuxtPlugin((nuxtApp) => {
    const vuetify = createVuetify({
        // ... your configuration
        theme: {
            defaultTheme: 'yachtDarkTheme',
            themes: {
                yachtDarkTheme,
            },
            variations: {
                colors: ['primary', 'secondary', 'tabs', 'foreground', 'surface'],
                lighten: 5,
                darken: 5,
            }
        },
    })
    nuxtApp.vueApp.use(vuetify)
})
