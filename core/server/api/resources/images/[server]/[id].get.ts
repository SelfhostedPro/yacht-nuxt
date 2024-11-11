import type { ImageInspectInfo } from 'dockerode'

export default defineEventHandler(async (event): Promise<ImageInspectInfo> => {
  const id = event.context.params?.id
  const server = event.context.params?.server
  if (!id || !server) throw createError('Image not specified')
  return await getImage(server, id)
})
