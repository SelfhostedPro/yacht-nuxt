import { H3Error } from 'h3'
import { sseHooks } from './sse'
import type { Notification } from '~/types/notifications'
import { createLogger, format, transports } from 'winston'

const logFormat = format.combine(
    format.errors({ stack: true }),
    format.timestamp({ format: 'MM-DD-YY hh:mm:ss A' }),
    format.cli(),
    format.metadata(),
    format.printf(({ level, message, timestamp, metadata }) => {
        return `[${timestamp}] [\u{1b}[34m${metadata.plugin}${metadata.function ? `\u{1b}[30m#${metadata.function}` : ''} ${level}]: ${message}`
    }),
)

const logger = createLogger({
    defaultMeta: { plugin: 'core', function: 'startup' },
    format: logFormat,
    transports: [new transports.Console()]
})
export function useLog(tag?: string) {
    return logger.child({ plugin: tag || 'core', function: '' })
}

export const YachtLog = (event: Notification, error?: H3Error, quiet?: boolean,) => {
    // logger.withTag(event.from || event.title || 'unknown')[event.level](`${event.message} ${event.from ? `\nFrom: ${event.from}` : ''}\n ${error ? `\nError: ${JSON.stringify(error)}` : ''}`)
    if (!quiet) {
        sseHooks.callHook("sse:notification", event)
    }
}

