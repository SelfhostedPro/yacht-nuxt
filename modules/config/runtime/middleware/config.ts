import { useClientConfig } from "../composables/client-config";

export default defineNuxtRouteMiddleware(async (to, from) => {
    if (import.meta.client) return
    const clientConfig = useClientConfig()
    try {
        const data = await useRequestFetch()<{ auth: boolean, wizard: boolean, theme: any, name: string }>("/api/settings/details");
        if (data) {
            clientConfig.value = data;
        }
    } catch (e) {
        // useToast({ title: 'Configuration Error', message: 'not able to configuration information. Please check logs.', level: 'error', dedupe: false })
        return await navigateTo({ path: '/login' }, { replace: true })
    }
})