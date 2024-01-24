import { H3Error } from 'h3'
import { sseHooks } from './sse'
import type { Notification } from '~/types/notifications'
import { type ConsolaOptions, createConsola, } from 'consola'

const logger = createConsola({ fancy: true, level: 3,  })

export function useLog (tag?: string, options: Partial<ConsolaOptions> = {}) {
    return tag ? logger.create(options).withTag(tag) : logger
  }

export const YachtLog = (event: Notification, error?: H3Error, quiet?: boolean,) => {
    logger.withTag(event.from || event.title || 'unknown')[event.level](`${event.message} ${error ? `\nError: ${JSON.stringify(error)}` : ''}`)
    if (!quiet) {
        sseHooks.callHook("sse:notification", event)
    }
}

