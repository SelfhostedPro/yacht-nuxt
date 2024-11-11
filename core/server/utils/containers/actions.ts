import type { CreateContainerForm } from "#core/types/containers/create"
import type { ServerDict } from "#core/types/servers"
import { normalizeContainerInspectInfo, normalizeCreate } from "./formatter"
import type Dockerode from "dockerode"
import type { ImagePullProgress } from "#core/types/images"
import { sseHooks } from "#core/server/utils/sse"
import { Logger } from '#notifications/server/composables/logger'
// Service Dependency Imports
import { getContainers } from './info'
import { processImageProgress } from "../resources/info"

export const createContainer = async (form: CreateContainerForm) => {
    const servers = await useServers()
    if (!servers) {
        throw createError('No servers available')
    }

    const server = servers[form.server]
    if (!server) {
        throw createError(`Server ${form.server} not found!`)
    }

    // YachtLog({ title: 'CreateContainer', level: 'info', from: `services/containers - createContainer`, message: `Creating container: ${form.name} from image: ${form.image} on server: ${server}` })
    const pullStream = await server.pull(form.image);
    await new Promise((res) => server.modem.followProgress(pullStream, res, (progress: ImagePullProgress) => {
        sseHooks.callHook("sse:progress", processImageProgress(progress, form.image))
        // sseHooks.callHook("sse:progress", { id: progress.id, title: `Pulling ${form.image}`, item: form.image, status: progress.status, progress } as Progress)
    }));
    // YachtLog({ title: 'CreateContainer', level: 'info', from: `services/containers - createContainer`, message: `Image: ${form.image} pulled successfully.` })
    let createdContainer: Dockerode.Container;
    return await server
        .createContainer(
            await normalizeCreate(form),
        )
        .catch((error) => {
            throw createError({ name: 'Docker Error', statusMessage: error.message, statusCode: error.statusCode, ...error })
        }).then(async (container) => {
            if (!container) throw createError(`Container ${form.name} not created!`)
            createdContainer = container
            container?.start().catch((err) => {
                throw createError({ name: 'Docker Error', statusMessage: err.message, statusCode: err.statusCode });
            });
            Logger(`Container: ${form.name} created successfully on ${form.server}.`, 'container - create', { title: 'CreateContainer', level: 'info', message: `Container: ${form.name} created successfully on ${form.server}.` })
            return await normalizeContainerInspectInfo(
                await server.getContainer(createdContainer.id).inspect(),
            );
        })
}

export const getContainerAction = async (server: string, id: string, action: string) => {
    const _server = await useServers().then((servers: ServerDict | undefined) => {
        if (!servers) {
            throw createError('No servers available')
        }
        const selectedServer = servers[server]
        if (!selectedServer) {
            throw createError(`Server ${server} not found`)
        }
        return selectedServer
    })

    const container = _server.getContainer(id)
    const actions = {
        start: () => container.start(),
        stop: () => container.stop(),
        pause: () => container.pause(),
        unpause: () => container.unpause(),
        kill: () => container.kill(),
        remove: () => container.remove({ force: true }),
        restart: () => container.restart(),
    } as const

    type ActionKey = keyof typeof actions
    const isValidAction = (key: string): key is ActionKey => key in actions

    if (isValidAction(action)) {
        try {
            await actions[action]()
            if (action !== 'remove') {
                const _container = await normalizeContainerInspectInfo(await container.inspect())
                Logger(`${action} performed on ${_container.info.title || _container.name}: ${_container.shortId}`, 'container - action', { title: 'ContainerAction', level: 'info', message: `${action} performed on ${_container.info.title || _container.name}: ${_container.shortId}`, timeout: 2000 })
            } else {
                Logger(`${action} performed on ${id}: ${container.id}`, 'services-containers', { title: 'ContainerAction', level: 'info', message: `${action} performed on ${id}: ${container.id}`, timeout: 2000 })
            }
            return await getContainers()
        } catch (e) {
            if (e instanceof Error) {
                const dockerError = e as { statusCode?: number; message: string }
                if (dockerError.statusCode === 304) {
                    Logger(`Container ${id} is already ${action}ed!`, 'containers - action', { message: `Container ${id} is already ${action}ed!`, level: 'info' })
                } else {
                    throw createError({
                        statusMessage: dockerError.message,
                        statusCode: dockerError.statusCode,
                    })
                }
            }
            return await getContainers()
        }
    } else {
        Logger(`Action ${action} not valid!`, 'ContainerActionError', { title: 'ContainerActionError', level: 'error', message: `Action ${action} not valid!` })
        throw createError(`Action ${action} not valid!`)
    }
}
