import { getContainerStats } from "~/server/services/containers/streams"

export default defineEventHandler(async (event) => {
  const { close } = useSSE(event, "sse:containerStats")
  getContainerStats(close)
  event.node.req.on("close", () => close())
})