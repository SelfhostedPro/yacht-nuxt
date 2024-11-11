export function useCustomTheme() {
    const { $vuetify } = useNuxtApp()

    const isDark = useDark({
        valueDark: 'LVDark',
        valueLight: 'LVLight',
        initialValue: 'dark',
        onChanged: (dark: boolean) => {
            $vuetify.theme.global.name.value = dark ? 'dark' : 'light'
        },
    })

    const toggle = useToggle(isDark)

    return { isDark, toggle }
}