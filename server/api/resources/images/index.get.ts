import { getImages } from '~/server/services/resources/info'
import type { ServerImages } from '~/types/servers'

export default defineEventHandler(async (): Promise<ServerImages> => {
  return await getImages()
})
