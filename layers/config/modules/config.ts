import { defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'
import { join } from 'path'

export default defineNuxtModule({
    meta: { name: 'config' },
    async setup(_, nuxt) {

        const defaultConfigOptions: ConfigOptions =
        {
            configPath: process.env.NODE_ENV === 'production' ? '../config' : './config',
            dataPath: process.env.NODE_ENV === 'production' ? '../data' : './data'
        }

        // Get paths from environment variables or use our default options
        const configOptions = defu({
            configPath: process.env.CONFIG_PATH,
            dataPath: process.env.DATA_PATH
        }, {
            configPath: join(nuxt.options.rootDir, defaultConfigOptions.configPath),
            dataPath: join(nuxt.options.rootDir, defaultConfigOptions.dataPath)
        })

        // Add config options to runtime config
        nuxt.options.yacht ||= {
            configOptions
        }

        nuxt.options.runtimeConfig.yacht ||= {
            configOptions
        }
    }
})

interface ConfigOptions {
    configPath: string,
    dataPath: string
}

declare module '@nuxt/schema' {
    interface NuxtOptions {
        yacht: {
            configOptions: ConfigOptions
        }
    }
    interface RuntimeConfig {
        yacht: {
            configOptions: ConfigOptions
        }
    }
}