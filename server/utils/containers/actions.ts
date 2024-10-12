import { type CreateContainerForm } from "~~/types/containers/create"
import { type ServerDict } from "~~/types/servers"
import { normalizeContainerInspectInfo, normalizeCreate } from "./formatter"
import type Dockerode from "dockerode"
import type { ImagePullProgress } from "~~/types/images"

// Service Dependency Imports
import { getContainers } from './info'
import { processImageProgress } from "../resources/info"



export const createContainer = async (form: CreateContainerForm) => {
    const server: Dockerode | null | undefined = await useServers().then((servers: ServerDict) => servers[form.server])
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
    const _server: Dockerode | null | undefined = await useServers().then((servers: ServerDict) => servers[server])

    if (!_server) {
        throw createError(new Error(`Server ${server} not found`))
    }

    const container = _server.getContainer(id)
    const actions = new Map([
        ['start', () => container.start()],
        ['stop', () => container.stop()],
        ['pause', () => container.pause()],
        ['unpause', () => container.unpause()],
        ['kill', () => container.kill()],
        ['remove', () => container.remove({ force: true })],
        ['restart', () => container.restart()],
    ])

    const actionFn = actions.get(action)
    if (!actionFn) {
        throw createError(new Error(`Action ${action} not valid`))
    }

    try {
        await actionFn()
        const logMessage = action === 'remove'
            ? `${action} performed on ${id}: ${container.id}`
            : `${action} performed on ${(await container.inspect()).Name}: ${container.id.substring(0, 10)}`

        Logger(logMessage, 'container - action', { title: 'ContainerAction', level: 'info', message: logMessage, timeout: 2000 })
        return await getContainers()
    } catch (e: any) {
        if (e.statusCode === 304) {
            Logger(`Container ${id} is already ${action}ed!`, 'containers - action', { message: `Container ${id} is already ${action}ed!`, level: 'info' })
        } else {
            throw createError(e)
        }
        return await getContainers()
    }
}

