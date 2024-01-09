import type { Notification } from '~/types/notifications'

export default defineEventHandler(async (event) => {
  const { send, close } = useSSE(event, "sse:notification")
  const initNotification: Notification = { title: "Connected", message: "Connected to notifications.", level: 'info', from: "/notifications", timeout: 3000, dedupe: true }
  send(() => (initNotification))

  event.node.req.on("close", () => close())
})
