import { useSSE } from '#core/server/utils/sse'

export default defineEventHandler(async (event) => {
    const { send, close } = useSSE(event, "sse:progress", false)
    send(() => 'Connected to progress.')
    event.node.req.on("close", () => close())
  })
  