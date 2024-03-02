const logger = useLog('config')
export default defineNitroPlugin(async (nitroApp) => {
    logger.log('initializing config...')
    await checkConfig()
    const config = await useConfig()
    logger.info('config', config)
    logger.log('config initialized.')
})
