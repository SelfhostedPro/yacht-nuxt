import { defineNuxtModule, addImportsDir, addServerImportsDir, addServerPlugin, installModule, createResolver } from '@nuxt/kit'
import config from '../config'
import type { Nuxt } from '@nuxt/schema'

export default defineNuxtModule({
    meta: { name: 'db' },
    async setup(_options: any, nuxt: Nuxt | undefined) {
        await installModule(config, null, nuxt)
        const resolver = createResolver(import.meta.url)
        addImportsDir(resolver.resolve('types'))
        addServerImportsDir(resolver.resolve('runtime/server/utils'))
        // addServerPlugin(resolver.resolve('plugin/02-server-db.ts'))
    }
})