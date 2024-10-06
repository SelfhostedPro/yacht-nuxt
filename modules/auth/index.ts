import { defineNuxtModule, addImportsDir, addServerHandler, createResolver, addRouteMiddleware, installModule, addImports } from '@nuxt/kit'
import db from '../db'
import config from '../config'
import type { Nuxt } from '@nuxt/schema'

export default defineNuxtModule({
    meta: { name: 'auth' },
    async setup(_options: any, nuxt: Nuxt | undefined) {
        await installModule(config, null, nuxt)
        await installModule(db, null, nuxt)
        const resolver = createResolver(import.meta.url)
        addImportsDir(resolver.resolve('types'))
        addImports([
            {
                name: "useUser",
                from: resolver.resolve("runtime/composables/user.ts")
            }
        ])
        addRouteMiddleware({
            name: 'auth',
            path: resolver.resolve('runtime/middleware/auth.ts'),
            global: true
        })
        addServerHandler({
            handler: resolver.resolve('runtime/server/middleware/auth.ts'),
            middleware: true
        })
        addServerHandler({
            handler: resolver.resolve('runtime/server/api/auth/login.post.ts'),
            route: '/api/auth/login'
        })
        addServerHandler({
            handler: resolver.resolve('runtime/server/api/auth/logout.post.ts'),
            route: '/api/auth/logout'
        })
        addServerHandler({
            handler: resolver.resolve('runtime/server/api/auth/me.get.ts'),
            route: '/api/auth/me'
        })
        addServerHandler({
            handler: resolver.resolve('runtime/server/api/auth/wizard.post.ts'),
            route: '/api/auth/wizard'
        })
        addServerHandler({
            handler: resolver.resolve('runtime/server/api/settings/details.ts'),
            route: '/api/settings/details'
        })
    }
})