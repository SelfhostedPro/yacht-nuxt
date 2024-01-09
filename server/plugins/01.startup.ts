import { useLogger } from '@nuxt/kit'
import ConfigController from '../utils/config'

export const Config = new ConfigController()

export default defineNitroPlugin(async (nitroApp) => {
    const logger = useLogger('startup:config')
    logger.info('Starting up config plugin...')
    Config.getConfig()
    logger.success('config plugin started.')
})