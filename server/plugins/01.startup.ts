import { useLogger } from '@nuxt/kit'

export default defineNitroPlugin(async (nitroApp) => {
    const logger = useLogger('startup:config')
    logger.info('Starting up config plugin...')
    await getConfig()
    logger.success('config plugin started.')
})