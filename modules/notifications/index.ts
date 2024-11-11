import { defineNuxtModule, addServerImportsDir, addImportsDir, addPlugin, addComponentsDir, createResolver, addServerHandler } from '@nuxt/kit'

export default defineNuxtModule({
    setup() {
        const resolver = createResolver(import.meta.url)
        // Types
        addImportsDir(resolver.resolve('types'))

        // Client Plugin
        addPlugin(resolver.resolve('runtime/plugins/sonner.client.ts'))

        // Frontend Imports
        addImportsDir(resolver.resolve('runtime/composables'))
        addImportsDir(resolver.resolve('runtime/stores'))

        // Components
        addComponentsDir({
            global: true,
            enabled: true,
            path: resolver.resolve('runtime/components')
        })

        // Backend Imports
        addServerHandler({
            route: '/api/notifications',
            handler: resolver.resolve('runtime/server/api/notifications.get.ts')
        })
        addServerHandler({
            route: '/api/progress',
            handler: resolver.resolve('runtime/server/api/progress.get.ts')
        })
        addServerImportsDir(resolver.resolve('runtime/server/composables'))
    }
})