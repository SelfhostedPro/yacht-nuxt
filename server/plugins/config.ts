const logger = useLog('config')
import { ConfigService } from "../services/utils/config"
export default defineNitroPlugin(async (nitroApp) => {
    logger.log('initializing config...')
    useConfig()
    logger.log('config initialized.')
})
