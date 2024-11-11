export default defineEventHandler(async (event) => {
  const server = event.context.params?.server
  const id = event.context.params?.id
  const action = event.context.params?.action

  if (!server || !id || !action) throw createError('Server, container or action not specified')
  return await getContainerAction(server, id, action)
})
