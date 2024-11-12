import type { ServerNetworks } from '#docker/types/servers'
import { getNetworks } from '#docker/server/utils/resources/info'

export default defineEventHandler(async ():Promise<ServerNetworks> => {
  return await getNetworks()
})
