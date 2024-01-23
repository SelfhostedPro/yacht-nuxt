import { useConfig } from '~/server/services/config/actions'

const logger = useLog('plugin:config')

export default defineNitroPlugin(async () => {
    logger.info('test')
    logger.info('Starting up config plugin...', { function: 'defineNitroPlugin' })
    await useConfig()
    logger.info('config plugin started.', { function: 'defineNitroPlugin' })
})
