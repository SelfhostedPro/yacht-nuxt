import { type LogType, createConsola, type ConsolaInstance, type ConsolaOptions } from 'consola'
// import {   } from 'consola'
import { defu } from 'defu'
import type { Notification } from '~~/modules/notifications/types/notifications'

// Create a single Consola instance
const consola = createConsola({ defaults: { tag: 'core' }, formatOptions: { colors: true, compact: false } })

const logFunction = (message: any, tag?: string, notification?: Notification, options?: ConsolaOptions) => {
  const logger = tag ? consola.withTag(tag) : consola
  logger.log(message)
  if (notification) sseHooks.callHook("sse:notification", notification)
}

const createLogFunction = (level: LogType) => {
  return (message: any, tag?: string, notification?: Notification) => {
    const logger = tag ? consola.withTag(tag) : consola
    logger[level](message)
    if (notification) sseHooks.callHook("sse:notification", notification)
  }
}

export const Logger = Object.assign(logFunction, {
  info: createLogFunction('info'),
  debug: createLogFunction('debug'),
  error: createLogFunction('error'),
  warn: createLogFunction('warn'),
  fatal: createLogFunction('fatal'),
  success: createLogFunction('success'),
  fail: createLogFunction('fail'), // Fixed typo: 'success' to 'fail'
  ready: createLogFunction('ready'),
})
