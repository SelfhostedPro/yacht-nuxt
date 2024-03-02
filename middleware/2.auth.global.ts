export default defineNuxtRouteMiddleware(async (from, to) => {
    const config = useClientConfig()
    if (
        process.client
        || from.path === '/login'
    ) return
    else {
        if (from.path.startsWith('/login')) console.log("You should never see this")
        const user = useUser();
        try {
            const data = await useRequestFetch()("/api/auth/me");
            if (data) {
                user.value = data;
            }
        } catch (e) {
            if (config.value?.auth === false) return
            useToast({ title: 'Authentication Error', message: 'not able to fetch user information. Please login again.', level: 'error', dedupe: false })
            return await navigateTo({ path: '/login' }, { replace: true })
        }
    }
});