import { useSSE } from "#core/server/utils/sse"
import { getContainerLogs } from "#docker/server/utils/containers/streams"

export default defineEventHandler(async (event) => {
  const server = event.context.params?.server
  const containerId = event.context.params?.id
  if (!server || !containerId) throw createError('Server or container not specified')

  const { close, send } = useSSE(event, "sse:containerLogs")
  await getContainerLogs(server, containerId, close, send)
  event.node.req.on("close", () => close())
})