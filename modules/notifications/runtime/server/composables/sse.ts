import { createHooks } from 'hookable'
import type { H3Event} from 'h3';
import { setResponseStatus } from 'h3'
// import { authHooks } from './auth'

export interface ServerSentEvent {
  [key: string]: <T, R>(data: T) => R | void
}

export const sseHooks = createHooks<ServerSentEvent>()
export const useSSE = (event: H3Event, hookName: string, unique: boolean = true) => {
  setHeader(event, 'content-type', 'text/event-stream')
  setHeader(event, 'cache-control', 'no-cache')
  setHeader(event, 'connection', 'keep-alive')
  setResponseStatus(event, 200)
  let id = 0

  const _hookname = unique && event.context.session?.id ? `${event.context.session.id}-${hookName}` : hookName

  sseHooks.hook(_hookname, (data: any) => {
    event.node.res.write(`id: ${id += 1}\n`)
    event.node.res.write(`data: ${JSON.stringify(data)}\n\n`)
    event.node.res.flushHeaders()
  })

  const send = (callback: (id: number) => any) => {
    sseHooks.callHook(_hookname, callback(id))
  }

  const close = (message?: string) => {
    if (message) send(() => message)
    event.node.res.end()
  }

  const error = (message: string) => {
    event.node.res.write(`id: ${id += 1}\n`)
    event.node.res.write(`error: ${message}\n`)
  }

  // authHooks.hook('logout', (session: string) => {
  //   if (event.context.session && event.context.session.id === session) {
  //     if (event.node.res.writable) close()
  //   }
  // })

  event._handled = true
  event.node.req.on("close", close)

  return { send, close, error, id }
}