import type { ServerImages } from '#core/types/servers'

export default defineEventHandler(async (): Promise<ServerImages> => {
  return await getImages()
})
