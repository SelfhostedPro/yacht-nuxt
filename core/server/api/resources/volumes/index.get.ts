import type { ServerVolumes } from '#core/types/servers'

export default defineEventHandler(async (): Promise<ServerVolumes> => {
  return await getVolumes()
})
