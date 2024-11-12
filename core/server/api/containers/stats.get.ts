import { useSSE } from "#core/server/utils/sse"
import { getContainerStats } from "#docker/server/utils/containers/streams"

export default defineEventHandler(async (event) => {
  const { close, send } = useSSE(event, "sse:containerStats")
  getContainerStats(close, send)
  event.node.req.on("close", () => close())
})