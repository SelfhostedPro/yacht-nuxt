import { useLogger } from '@nuxt/kit'
import { H3Error } from 'h3'

const logger = useLogger()

export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook("error", async (error, { event }) => {
        logger.withTag('Unknown').error(`Unhandled Error:`, `${error}`, `${event}`)
    });
})