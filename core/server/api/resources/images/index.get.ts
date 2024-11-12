import type { ServerImages } from '#docker/types/servers'
import { getImages } from '#docker/server/utils/resources/info'

export default defineEventHandler(async (): Promise<ServerImages> => {
  return await getImages()
})
