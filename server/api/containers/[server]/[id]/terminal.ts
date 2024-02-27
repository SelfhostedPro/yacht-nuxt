import { streamContainerStdout } from '~/server/services/containers/terminal'
import { type Duplex } from 'stream'
import { v4 } from 'uuid'

const terminalSessions: { [session: string]: { stream: Duplex } } = {}

export default defineEventHandler(async (event) => {
  const server = event.context.params?.server
  const containerId = event.context.params?.id


  if (!server || !containerId) throw createError('Server or container not specified')

  if (event.method === 'GET') {
    // Generate unique ID for this request
    const reqId = v4().toString()
    // Get SSE send and close functions
    const { send, close, error } = useSSE(event, `terminal:${containerId}-${reqId}`)

    terminalSessions[`terminal:${containerId}-${reqId}`] = await streamContainerStdout(server, containerId, send, close, error, reqId)

    // Send initial connection notification
    send(() => ({ id: reqId, data: '' }))
    event.node.req.on("close", () => {
      terminalSessions[`terminal:${containerId}-${reqId}`].stream.destroy()
      delete terminalSessions[`terminal:${containerId}-${reqId}`]
      close()
    })
  }
  if (event.method === 'POST') {
    const { data, id } = await readBody<{ id: String, data: ArrayBuffer | Uint8Array | string }>(event)
    if (!data || !id) throw createError('Data or id not specified')
    terminalSessions[`terminal:${containerId}-${id}`].stream.write(data)
  }
  return 'Hello Nitro'
})
