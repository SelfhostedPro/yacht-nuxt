
export default defineEventHandler(async (event) => {
  try {

    const { close, send } = useSSE(event, "sse:containerStats")
    getServerStats(close, send)
    event.node.req.on("close", () => close())
  } catch (error) {
    if (error instanceof Error) {
      throw createError(error.message)
    } else {
      throw createError("An unknown error occurred")
    }
  }
})