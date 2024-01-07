import { YachtHooks } from "../utils/hooks"
import type { NotificationEvent } from '~/types/notifications'

export default defineEventHandler(async (event) => {
  // Enable SSE endpoint
  setHeaders(event, {
    "Transfer-Encoding": "chunked",
    "Content-Type": "text/event-stream",
    "Connection": "keep-alive",
    "Cache-Control": "no-cache",
  });
  setResponseStatus(event, 200);


  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = async (message: NotificationEvent) => {
    await writer.write(encoder.encode(`data: ${message}\n\n`))
  }

  YachtHooks.hook('notification:event', sendEvent)


  async function cleanup() {
    if (!writer.closed) {
      await writer.close();
    }
    if (!event.node.res.closed) {
      event.node.res.end();
    }
  }

  event.node.req
    .on("close", async () => {
      console.log("CLOSED");
      await cleanup();
    })
    .on("end", async () => {
      console.log("ENDED");
      await cleanup();
    });


  // Let the connection opened
  event._handled = true;
  await sendStream(event, readable);
})
