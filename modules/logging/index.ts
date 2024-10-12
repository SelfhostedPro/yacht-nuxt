import { defineNuxtModule, addServerImportsDir, installModule, createResolver, addServerPlugin } from '@nuxt/kit'
import core from '../notifications'
import type { Nuxt } from '@nuxt/schema'

export default defineNuxtModule({
    meta: { name: 'logging' },
    async setup(_options: any, nuxt: Nuxt | undefined) {
        await installModule(core, null, nuxt)
        const resolver = createResolver(import.meta.url)
        addServerImportsDir(resolver.resolve('runtime/server/composables'))
        addServerPlugin(resolver.resolve('plugin/02-server-error.ts'))
    }
})