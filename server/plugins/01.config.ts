import consola from 'consola'

export default defineNitroPlugin(async (nitroApp) => {
    const logger = consola.withTag('startup:config')
    logger.info('Starting up config plugin...')
    await getConfig()
    logger.success('config plugin started.')
})

