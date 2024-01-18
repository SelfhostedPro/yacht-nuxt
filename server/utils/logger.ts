import { useLogger } from '@nuxt/kit'
import { H3Error } from 'h3'
import { sseHooks } from './sse'
import type { Notification } from '~/types/notifications'

var logger = useLogger()
export const YachtLog = (event: Notification, error?: H3Error, quiet?: boolean) => {
    logger.withTag(event.title || 'unknown')[event.level](`${event.message} ${event.from ? `\nFrom: ${event.from}` : ''}\ ${error ? `\nRest: ${JSON.stringify(error)}` : ''}`)
    if (!quiet) {
        sseHooks.callHook("sse:notification", event)
    }
}