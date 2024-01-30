import { type Container } from "~/types/containers/yachtContainers"
import { type ServerContainers, type ServerDict } from "~/types/servers"
import { normalizeContainers, normalizeContainerInspectInfo } from "./formatter"

// Service Dependency Imports
import { useServers } from '../servers'


export const getContainers = async () => {
    const serversReturn = {} as ServerContainers
    const servers = Object.entries(await useServers())
    // Get containers from all servers in config
    const serverPromises = servers.map(
        async ([server, docker]) => {
            const containers = await docker?.listContainers({ all: true }).catch((e) => {
                YachtError(e, '/services/containers - getContainers')
                return undefined
            })
            if (containers !== undefined) serversReturn[server] = await normalizeContainers(containers)
            else serversReturn[server] = [] as Container[]
        },
    )
    // Wait for containers to resolve
    await Promise.all(serverPromises)
    return serversReturn

}

export const getContainerInfo = async (server: string, id: string) => {
    const _server = await useServers().then((servers: ServerDict) => servers[server])
    if (!_server) throw YachtError(new Error(`Server ${server} not found!`), '/services/containers/info - getContainerInfo')
    return normalizeContainerInspectInfo(await _server.getContainer(id).inspect())
}