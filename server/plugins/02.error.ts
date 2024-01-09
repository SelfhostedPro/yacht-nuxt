import { useLogger } from '@nuxt/kit'

const logger = useLogger()

export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook("error", async (error, { event }) => {
        logger.withTag('Unknown').error(`Unhandled Error:`, `${error}`, `${event}`)
    });
})