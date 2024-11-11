import { type LogType, createConsola, type ConsolaOptions } from 'consola'
import { defu } from 'defu'
import type { Notification } from '~~/modules/notifications/types/notifications'

const logFunction = (message: unknown, tag?: string, notification?: Notification, options?: ConsolaOptions) => {
  createConsola(defu({ defaults: { tag: tag }, ...options }, { defaults: { tag: 'core' } })).log(message)
  if (notification) sseHooks.callHook("sse:notification", notification as Notification)
}

const createLogFunciton = (level: LogType) => {
  return (message: unknown, tag?: string, notification?: Notification, options?: ConsolaOptions) => {
    createConsola(defu({ defaults: { tag: tag }, ...options }, { defaults: { tag: 'core' } }))[level](message)
    if (notification) sseHooks.callHook("sse:notification", notification as Notification)
  }
}

export const Logger = Object.assign(logFunction, {
  info: createLogFunciton('info'),
  debug: createLogFunciton('debug'),
  error: createLogFunciton('error'),
  warn: createLogFunciton('warn'),
  fatal: createLogFunciton('fatal'),
  sucess: createLogFunciton('success'),
  fail: createLogFunciton('success'),
  ready: createLogFunciton('ready'),
})