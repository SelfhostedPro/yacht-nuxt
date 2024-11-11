import type { Duplex } from 'stream'
import { v4 } from 'uuid'

const terminalSessions = new Map<string, { stream: Duplex }>()

export default defineEventHandler(async (event) => {
  const server = event.context.params?.server
  const containerId = event.context.params?.id

  if (!server || !containerId) throw createError('Server or container not specified')

  if (event.method === 'GET') {
    // Generate unique ID for this request
    const reqId = v4().toString()
    // Get SSE send and close functions
    const { send, close, error } = useSSE(event, `terminal:${containerId}-${reqId}`)

    const sessionKey = `terminal:${containerId}-${reqId}`
    terminalSessions.set(sessionKey, await streamContainerStdout(server, containerId, send, close, error, reqId))

    // Send initial connection notification
    send(() => ({ id: reqId, data: '' }))
    event.node.req.on("close", () => {
      const session = terminalSessions.get(sessionKey)
      if (session) {
        session.stream.destroy()
        terminalSessions.delete(sessionKey)
      }
      close()
    })
  }
  if (event.method === 'POST') {
    const { data, id } = await readBody<{ id: string, data: ArrayBuffer | Uint8Array | string }>(event)
    if (!data || !id) throw createError('Data or id not specified')
    const session = terminalSessions.get(`terminal:${containerId}-${id}`)
    if (session) {
      session.stream.write(data)
    }
  }
  return 'Hello Nitro'
})
