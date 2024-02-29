const logger = useLog('config')
export default defineNitroPlugin(async (nitroApp) => {
    logger.log('initializing config...')
    await useConfig()
    logger.log('config initialized.')
})
