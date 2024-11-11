import { useSSE } from "#core/server/utils/sse"
export default defineEventHandler(async (event) => {
  const { close, send } = useSSE(event, "sse:containerStats")
  getContainerStats(close, send)
  event.node.req.on("close", () => close())
})