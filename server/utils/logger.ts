import { useLogger } from '@nuxt/kit'
import { H3Error } from 'h3'
import { sseHooks } from './sse'
import type { Notification } from '~/types/notifications'
var logger = useLogger()

export const YachtLog = (event: Notification, error?: H3Error) => {
    logger.withTag(event.title || 'unknown')[event.level](`${event.message} \nFrom: ${event.from}\nRest: ${JSON.stringify(error)}}`)
    sseHooks.callHook("sse:notification", event)
}