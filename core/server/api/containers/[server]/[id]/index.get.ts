export default defineEventHandler(async (event) => {
  // event.context.params.slug to get the route segment: 'bar/baz'
  const server = event.context.params?.server
  const id = event.context.params?.id
  if (!server || !id) throw createError('Server or container not specified')
  return await getContainerInfo(server, id)
})
