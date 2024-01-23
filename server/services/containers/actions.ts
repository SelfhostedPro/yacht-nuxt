import { type ServerDict } from "~/types/servers"
import { normalizeContainerInspectInfo } from "./formatter"
import type Dockerode from "dockerode"

// Service Dependency Imports
import { getContainers } from './info'
import { getServers } from '~/server/services/servers'



export const getContainerAction = async (server: string, id: string, action: string) => {
    const _server: Dockerode | null = await getServers().then((servers: ServerDict) => servers[server])

    if (_server) {
        const container = _server.getContainer(id)
        const actions: { [action: string]: () => void } = {
            start: async () => container.start(),
            stop: async () => container.stop(),
            pause: async () => container.pause(),
            unpause: async () => container.unpause(),
            kill: async () => container.kill(),
            remove: async () => container.remove({ force: true }),
            restart: async () => container.restart(),
        }
        if (action in actions) {
            try {
                await actions[action]()
                const _container = await normalizeContainerInspectInfo(await container.inspect())
                YachtLog({ title: 'ContainerAction', level: 'info', message: `${action} performed on ${_container.info.title || _container.name}: ${_container.shortId}`, timeout: 2000 })
                return await getContainers()
            } catch (e) {
                YachtError(e)
                return await getContainers()
            }

        } else {
            YachtLog({ title: 'ContainerActionError', level: 'error', from: '/utils/containers.ts - getContainerAction', message: `Action ${action} not valid!` })
            throw createError(`Action ${action} not valid!`)
        }
    }
}

