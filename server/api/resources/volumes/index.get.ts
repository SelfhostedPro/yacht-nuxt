import type { ServerVolumes } from '~~/types/servers'

export default defineEventHandler(async (): Promise<ServerVolumes> => {
  return await getVolumes()
})
