import type { User } from "../../types/user";
import { useClientConfig } from "~/modules/config/runtime/composables/client-config";
import { useUser } from "../composables/user";

export default defineNuxtRouteMiddleware(async (from, to) => {
    // console.log(`${from.path} => ${to.path}`)
    const config = useClientConfig()
    if (
        import.meta.client
        || config.value?.auth === false
        || from.path === '/login'
    ) return
    else {
        const user = useUser();
        try {
            const data = await useRequestFetch()<User | null>("/api/auth/me");
            if (data) {
                user.value = data;
            }
        } catch (e) {
            // useToast({ title: 'Authentication Error', message: 'not able to fetch user information. Please login again.', level: 'error', dedupe: false })
            return await navigateTo({ path: '/login' }, { replace: true })
        }
    }
});