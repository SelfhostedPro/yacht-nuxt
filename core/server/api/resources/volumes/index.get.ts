import type { ServerVolumes } from '#docker/types/servers'
import { getVolumes } from '#docker/server/utils/resources/info'

export default defineEventHandler(async (): Promise<ServerVolumes> => {
  return await getVolumes()
})
