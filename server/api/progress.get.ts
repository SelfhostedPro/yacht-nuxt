
export default defineEventHandler(async (event) => {
  const { send, close } = useSSE(event, "sse:progress", false)
  event.node.req.on("close", () => close())
})
