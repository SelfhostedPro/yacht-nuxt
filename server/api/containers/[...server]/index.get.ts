import { createRouter, defineEventHandler, useBase } from 'h3'

const router = createRouter()

router.get('/:server/info/:id', defineEventHandler(async (event) => {
    // event.context.params.slug to get the route segment: 'bar/baz'
    const server = event.context.params?.server
    const id = event.context.params?.id
    if (!server || !id) return 'Server or container not specified'
    return await getContainerInfo(server, id)
}))

router.get('/:server/action/:id/:action', defineEventHandler(async (event) => {
    const server = event.context.params?.server
    const id = event.context.params?.id
    const action = event.context.params?.action

    if (!server || !id || !action) return 'Server, container or action not specified'
    return await getContainerAction(server, id, action)
}))

export default useBase('/api/containers', router.handler)