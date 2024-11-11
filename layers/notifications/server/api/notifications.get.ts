import type { Notification } from "#notifications/types/notifications"
import { useSSE } from '#core/server/utils/sse'

export default defineEventHandler(async (event) => {
    const { send, close } = useSSE(event, "sse:notification", false)
    const initNotification: Notification = { title: "Connected", message: "Connected to notifications.", level: 'info', timeout: 3000, dedupe: true }
    send(() => (initNotification))

    event.node.req.on("close", () => close())
})
