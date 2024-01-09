import { type Container } from "~/types/containers/yachtContainers"
import { type ServerContainers } from "~/types/servers"

export const getContainers = async () => {
    const serversReturn = {} as ServerContainers
    const servers = Object.entries(await getServers())

    // Get containers from all servers in config
    const serverPromises = servers.map(
        async ([server, docker]) => {
            const containers = await docker?.listContainers({ all: true })
            if (containers !== undefined) serversReturn[server] = await normalizeContainers(containers)
            else serversReturn[server] = [] as Container[]
        },
    )
    // Wait for containers to resolve
    await Promise.all(serverPromises)
    return serversReturn
}

export const getContainerInfo = async (server: string, id: string) => {
    const _server = await getServers().then((servers) => servers[server])
    if (_server) {
        try {
            return _server.getContainer(id).inspect()
        } catch (e) {
            YachtError(e)
        }
    } else createError(`Server ${server} not found!`)
}

export const getContainerAction = async (server: string, id: string, action: string) => {
    const _server = await getServers().then((servers) => servers[server])

    if (_server) {
        const container = _server.getContainer(id)
        const actions: { [key: string]: (res: (value: unknown) => void, rej: (value: unknown) => void) => Promise<any> } = {
            start: async (res, rej) => container.start((err, data) => err ? rej(err) : res(data)),
            stop: async (res, rej) => container.stop((err, data) => err ? rej(err) : res(data)),
            pause: async (res, rej) => container.pause((err, data) => err ? rej(err) : res(data)),
            unpause: async (res, rej) => container.unpause((err, data) => err ? rej(err) : res(data)),
            kill: async (res, rej) => container.kill((err, data) => err ? rej(err) : res(data)),
            remove: async (res, rej) => container.remove({ force: true }, (err, data) => err ? rej(err) : res(data)),
            restart: async (res, rej) => container.restart((err, data) => err ? rej(err) : res(data)),
        };

        if (action in actions) {
            try {
                await new Promise((res, rej) => actions[action](res, rej))
                const _container = await normalizeContainerInspectInfo(await container.inspect())
                YachtLog({ title: 'ContainerAction', level: 'info', from: '/utils/containers.ts - getContainerAction', message: `${action} performed on ${_container.info.title || _container.name}: ${_container.shortId}`, timeout: 2000 })
                console.log(`${action} performed on ${_container.shortId}`)
                return await getContainers()
            } catch (e) {
                YachtError(e)
                return await getContainers()
            }

        } else {
            YachtLog({ title: 'ContainerActionError', level: 'error', from: '/utils/containers.ts - getContainerAction', message: `Action ${action} not valid!` })
            return `Action ${action} not valid!`
        }
    }
}