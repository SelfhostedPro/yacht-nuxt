import type { ServerNetworks } from '#core/types/servers'

export default defineEventHandler(async ():Promise<ServerNetworks> => {
  return await getNetworks()
})
