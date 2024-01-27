import { type CreateContainerForm } from "~/types/containers/create"
import { type ServerDict } from "~/types/servers"
import { normalizeContainerInspectInfo, normalizeCreate } from "./formatter"
import type Dockerode from "dockerode"

// Service Dependency Imports
import { getContainers } from './info'
import { useServers } from '~/server/services/servers'

export const createContainer = async (server: string, form: CreateContainerForm) => {
    const containerLog = useLog(`container - ${form.name} - ${server}}`)
    const _server: Dockerode | null = await useServers().then((servers: ServerDict) => servers[server])
    if (!_server) {
        throw createError(`Server ${server} not found!`)
    }
    YachtLog({ title: 'CreateContainer', level: 'info', from: `services/containers - createContainer`, message: `Creating container: ${form.name} from image: ${form.image} on server: ${server}` })
    const pullStream = await _server.pull(form.image);
    await new Promise((res) => _server.modem.followProgress(pullStream, res, (progress) => {
        containerLog.info(progress)
    }));
    YachtLog({ title: 'CreateContainer', level: 'info', from: `services/containers - createContainer`, message: `Image: ${form.image} pulled successfully.` })
    let createdContainer: Dockerode.Container;
    return await _server
        .createContainer(
            await normalizeCreate(form),
        )
        .catch((err) => {
            throw err;
        }).then(async (container) => {
            createdContainer = container
            container.start().catch((err) => {
                throw err;
            });
            YachtLog({ title: 'CreateContainer', level: 'info', from: `services/containers - createContainer`, message: `Container: ${form.name} created successfully on ${server}.` })
            return await normalizeContainerInspectInfo(
                await _server.getContainer(createdContainer.id).inspect(),
            );
        })

}


export const getContainerAction = async (server: string, id: string, action: string) => {
    const _server: Dockerode | null = await useServers().then((servers: ServerDict) => servers[server])

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
                YachtLog({ title: 'ContainerAction', level: 'info', from: `services/containers - getContainerAction`, message: `${action} performed on ${_container.info.title || _container.name}: ${_container.shortId}`, timeout: 2000 })
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

