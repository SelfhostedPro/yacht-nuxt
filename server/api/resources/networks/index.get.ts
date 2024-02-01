import { getNetworks } from '~/server/services/resources/info'
import type { ServerNetworks } from '~/types/servers'

export default defineEventHandler(async ():Promise<ServerNetworks> => {
  return await getNetworks()
})
