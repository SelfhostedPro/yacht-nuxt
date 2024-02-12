import { type CreateContainerForm } from "~/types/containers/create"
import { type ServerDict } from "~/types/servers"
import { normalizeContainerInspectInfo, normalizeCreate } from "./formatter"
import type Dockerode from "dockerode"
import type { Notification, Progress } from "~/types/notifications"
import type { ImagePullProgress } from "~/types/images"

// Service Dependency Imports
import { getContainers } from './info'
import { useServers } from '~/server/services/servers'



export const createContainer = async (form: CreateContainerForm) => {
    const containerLog = useLog(`container - ${form.name} - ${form.server}}`)
    const server: Dockerode | null = await useServers().then((servers: ServerDict) => servers[form.server])
    if (!server) {
        throw createError(`Server ${form.server} not found!`)
    }
    // YachtLog({ title: 'CreateContainer', level: 'info', from: `services/containers - createContainer`, message: `Creating container: ${form.name} from image: ${form.image} on server: ${server}` })
    const pullStream = await server.pull(form.image);
    await new Promise((res) => server.modem.followProgress(pullStream, res, (progress: ImagePullProgress) => {
        sseHooks.callHook("sse:progress", { id: progress.id, title: `Pulling ${form.image}`, item: form.image, status: progress.status, progress } as Progress)
    }));
    // YachtLog({ title: 'CreateContainer', level: 'info', from: `services/containers - createContainer`, message: `Image: ${form.image} pulled successfully.` })
    let createdContainer: Dockerode.Container;
    return await server
        .createContainer(
            await normalizeCreate(form),
        )
        .catch((err) => {
            throw YachtError(err, `services/containers - createContainer ${form.name} on ${form.server} failed!`);
        }).then(async (container) => {
            if (!container) throw YachtError(`Container ${form.name} not created!`)
            createdContainer = container
            container?.start().catch((err) => {
                throw err;
            });
            YachtLog({ title: 'CreateContainer', level: 'info', from: `services/containers - createContainer`, message: `Container: ${form.name} created successfully on ${form.server}.` })
            return await normalizeContainerInspectInfo(
                await server.getContainer(createdContainer.id).inspect(),
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
                if (action !== 'remove') {
                    const _container = await normalizeContainerInspectInfo(await container.inspect())
                    YachtLog({ title: 'ContainerAction', level: 'info', from: `services/containers - getContainerAction`, message: `${action} performed on ${_container.info.title || _container.name}: ${_container.shortId}`, timeout: 2000 })

                } else YachtLog({ title: 'ContainerAction', level: 'info', from: `services/containers - getContainerAction`, message: `${action} performed on ${id}: ${container.id}`, timeout: 2000 })
                return await getContainers()
            } catch (e: Error | any) {
                if (e.statusCode && e.statusCode === 304) {
                    YachtLog({ message: `Container ${id} is already ${action}ed!`, level: 'info', from: `services/containers - getContainerAction` }, undefined, true)
                } else {
                    YachtError(e)
                }
                return await getContainers()
            }

        } else {
            YachtLog({ title: 'ContainerActionError', level: 'error', from: '/utils/containers.ts - getContainerAction', message: `Action ${action} not valid!` })
            throw createError(`Action ${action} not valid!`)
        }
    }
}

