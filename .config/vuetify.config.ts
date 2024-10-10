import { defineVuetifyConfiguration } from 'vuetify-nuxt-module/custom-configuration'
import type { ThemeDefinition } from 'vuetify'

const LVDark: ThemeDefinition = {
    dark: true,
    colors: {
        primary: "#47978F",
        secondary: "#424242",
        background: "#000000",
        tabs: "#1E1E1E",
        foreground: "#323232"
    },
}
const LVLight: ThemeDefinition = {
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
    labComponents: ["VTreeview", "VTreeviewGroup", "VTreeviewItem"],
    theme: {
        defaultTheme: 'LVDark',
        themes: {
            LVDark,
            LVLight
        },
        variations: {
            colors: ['primary', 'secondary', 'tabs', 'foreground', 'surface'],
            lighten: 5,
            darken: 5,
        }
    },
    icons: {
        defaultSet: 'mdi',
        sets: ['mdi', 'fa']
    }
})