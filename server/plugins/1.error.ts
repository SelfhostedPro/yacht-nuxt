const logger = useLog('error plugin')
import { H3Error } from 'h3'

const errorMap = [
    (e: Error) => e instanceof H3Error ? e as H3Error : false,
    // (e: Error) => e.reason === "server error" && String(e.message).includes("failed: port is already allocated")
]

export default defineNitroPlugin(async (nitroApp) => {
    logger.debug('initializing error handler...')
    nitroApp.hooks.hook('error', (error, { event }) => {
        logger.error(error.message, event?.node.req.url)
        // errorMap.map((fn) => fn(error) ? )
    })
    logger.debug('error handler initialized.')
})