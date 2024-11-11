// import { checkConfig } from '../utils/lvconfig'
// import { Logger } from '../utils/lvlogger'
import { checkConfig } from "#config/server/utils/config"
import { Logger } from "#notifications/server/composables/logger"
// Loading the config on initialization so we can make sure settings are applied on startup.
export default defineNitroPlugin(() => {
    Logger.info('initializing config module...', 'config')
    return checkConfig().then(() => {
        Logger.ready('config module initialized.', 'config')
        return;
    })
})