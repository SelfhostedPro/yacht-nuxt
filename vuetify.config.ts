import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'
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
const yachtLightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        primary: "#47978F",
        secondary: "#476460",
        background: "#FFFFFF",
        tabs: "#476460",
        foreground: "#EBEFED"
    },
}

export default defineVuetifyConfiguration({
    theme: {
        defaultTheme: 'yachtDarkTheme',
        themes: {
            yachtDarkTheme,
            yachtLightTheme
        },
        variations: {
            colors: ['primary', 'secondary', 'tabs', 'foreground', 'surface'],
            lighten: 5,
            darken: 5,
        }
    },
})