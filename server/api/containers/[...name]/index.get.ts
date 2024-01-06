import Docker from 'dockerode'
import { createRouter, defineEventHandler, useBase } from 'h3'
import containerAction from './actions'

const router = createRouter()

router.get('/:name', defineEventHandler((event) => {
    const docker = new Docker()
    // event.context.params.slug to get the route segment: 'bar/baz'
    const id = event.context.params?.name

    if (id) {
        return docker.getContainer(id).inspect()
    } else {
        return 'Container not found'
    }
}))

router.get('/:name/:action', defineEventHandler(async (event) => {
    const id = event.context.params?.name
    const action = event.context.params?.action
    if (id && action) {
        return await containerAction(id, action)
    } else {
        return ('ID or Action undefined.')
    }
}))

export default useBase('/api/containers', router.handler)