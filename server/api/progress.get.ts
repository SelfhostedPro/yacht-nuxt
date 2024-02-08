
export default defineEventHandler(async (event) => {
  const { send, close } = useSSE(event, "sse:progress")
  event.node.req.on("close", () => close())
})
