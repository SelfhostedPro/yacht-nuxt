import type { YachtConfig } from "../../types";
import { useClientConfig } from "../composables/client-config";

export default defineNuxtRouteMiddleware(async () => {
    if (import.meta.client) return
    const clientConfig = useClientConfig()
    try {
        const data = await useRequestFetch()<{ auth: boolean, wizard: boolean, theme: YachtConfig['theme'], name: string }>("/api/settings/details");
        if (data) {
            clientConfig.value = data;
        }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        // useToast({ title: 'Configuration Error', message: 'not able to configuration information. Please check logs.', level: 'error', dedupe: false })
        return await navigateTo({ path: '/login' }, { replace: true })
    }
})