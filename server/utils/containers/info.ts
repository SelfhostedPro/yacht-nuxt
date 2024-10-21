import { type Container } from "~~/types/containers/yachtContainers"
import { type ServerContainers, type ServerDict } from "~~/types/servers"
import { normalizeContainers, normalizeContainerInspectInfo } from "./formatter"

export const getContainers = async () => {
    const serversReturn = {} as ServerContainers
    const servers = Object.entries(await useServers())
    // Get containers from all servers in config
    const serverPromises = servers.map(
        async ([server, docker]) => {
            const containers = await docker?.listContainers({ all: true }).catch((e) => {
                createError(e)
                return undefined
            })
            if (containers !== undefined) serversReturn[server] = await normalizeContainers(containers)
            else serversReturn[server] = [] as Container[]
        },
    )
    // Wait for containers to resolve
    await Promise.all(serverPromises)
    
    // Sort servers alphabetically
    return Object.fromEntries(
        Object.entries(serversReturn).sort(([a], [b]) => a.localeCompare(b))
    ) as ServerContainers
}

export const getContainerInfo = async (server: string, id: string) => {
    const _server = await useServers().then((servers: ServerDict) => servers[server])
    if (!_server) throw createError(new Error(`Server ${server} not found!`))
    return normalizeContainerInspectInfo(await _server.getContainer(id).inspect())
}

