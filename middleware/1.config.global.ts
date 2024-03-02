export default defineNuxtRouteMiddleware(async (to, from) => {
    if (process.client) return
    const clientConfig = useClientConfig()
    try {
        const data = await useRequestFetch()("/api/settings/details");
        if (data) {
            clientConfig.value = data;
        }
    } catch (e) {
        useToast({ title: 'Configuration Error', message: 'not able to configuration information. Please check logs.', level: 'error', dedupe: false })
        return await navigateTo({ path: '/login' }, { replace: true })
    }
})
