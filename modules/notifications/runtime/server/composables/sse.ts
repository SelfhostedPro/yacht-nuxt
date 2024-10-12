import { createHooks } from 'hookable'
import { H3Event, setResponseStatus } from 'h3'
// import { authHooks } from './auth'

export interface ServerSentEvent {
  [key: string]: <T, R>(data: T) => R | void
}

export const sseHooks = createHooks<ServerSentEvent>()
export const useSSE = (event: H3Event, hookName: string, unique: boolean = true) => {
  try {
    setHeader(event, 'content-type', 'text/event-stream')
    setHeader(event, 'cache-control', 'no-cache')
    setHeader(event, 'connection', 'keep-alive')
    setResponseStatus(event, 200)
    let id = 0

    const _hookname = unique && event.context.session?.id ? `${event.context.session.id}-${hookName}` : hookName

    sseHooks.hook(_hookname, (data: any) => {
      try {
        event.node.res.write(`id: ${id += 1}\n`)
        event.node.res.write(`data: ${JSON.stringify(data)}\n\n`)
        event.node.res.flushHeaders()
      } catch (error) {
        console.error('Error writing SSE data:', error)
      }
    })

    const send = (callback: (id: number) => any) => {
      try {
        sseHooks.callHook(_hookname, callback(id))
      } catch (error) {
        console.error('Error sending SSE data:', error)
      }
    }

    const close = (message?: string) => {
      try {
        if (message) send(() => message)
        event.node.res.end()
      } catch (error) {
        console.error('Error closing SSE connection:', error)
      }
    }

    const error = (message: string) => {
      try {
        event.node.res.write(`id: ${id += 1}\n`)
        event.node.res.write(`error: ${message}\n`)
      } catch (error) {
        console.error('Error sending SSE error:', error)
      }
    }

    event._handled = true
    event.node.req.on("close", close)

    return { send, close, error, id }
  } catch (error) {
    console.error('Error setting up SSE:', error)
    return { send: () => {}, close: () => {}, error: () => {}, id: 0 }
  }
}
