import { useLogger } from '@nuxt/kit'
import { H3Error } from 'h3'
import type { NotificationEvent } from '~/types/notifications'
var logger = useLogger()

export const YachtLog = (event: NotificationEvent, error?: H3Error) => {
    logger.withTag(event.title || 'unknown')[event.level](`${event.message} \nFrom: ${event.from}\nRest: ${JSON.stringify(error)}}`)
    YachtHooks.callHook('notification:event', event)
}