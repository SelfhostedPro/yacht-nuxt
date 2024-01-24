import { useConfig } from '~/server/services/config/actions'

export default defineNitroPlugin(async () => {
    YachtLog({ level: 'info', message: 'config plugin started.', from: 'plugin/config - defineNitroPlugin' })
    await useConfig()
    YachtLog({ level: 'info', message: 'config plugin started.', from: 'plugin/config - defineNitroPlugin' })
})
