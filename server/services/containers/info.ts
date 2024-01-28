import { type Container } from "~/types/containers/yachtContainers"
import { type ServerContainers, type ServerDict } from "~/types/servers"
import { type FixedContainerStats, formatStats } from "./streams"
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

export const getContainerStats = async (close: () => void) => {
    const servers = Object.entries(await useServers())
    // Get all servers
    servers.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async ([_server, docker]): Promise<void> => {

            // Get all containers on server
            const containers = await docker?.listContainers({ all: true }).catch((e) => {
                YachtError(e, '/services/containers - getContainerStats')
                return undefined
            })
            if (containers === undefined) {
                close()
                return
            } else {
                containers.map(
                    async (container) => {
                        if (container.State === 'running') {
                            // Get container object
                            const _container = docker?.getContainer(container.Id)
                            if (_container !== undefined) {

                                // Cache stats so we only send when they change
                                let cachedStats: FixedContainerStats | null = null;
                                // Placeholder string to assemble chunks of data
                                let partialChunk = '';

                                // Start streaming stats
                                _container.stats({ stream: true }, (err, stream) => {
                                    stream?.on('data', (data: Buffer) => {
                                        const chunkString = partialChunk + data.toString() // turn the chunk buffer into a string
                                        const jsonChunks = chunkString.split('\n'); // Split on newlines
                                        partialChunk = jsonChunks.pop() || ''; // Store any incomplete chunk for the next iteration
                                        jsonChunks.forEach((jsonChunk) => {
                                            const containerStats: FixedContainerStats = JSON.parse(jsonChunk);
                                            if (
                                                !cachedStats ||
                                                containerStats.name !== cachedStats.name ||
                                                containerStats.cpu_stats.cpu_usage.total_usage !== cachedStats.cpu_stats.cpu_usage.total_usage ||
                                                containerStats.memory_stats.usage !== cachedStats.memory_stats.usage
                                            ) {
                                                cachedStats = containerStats;
                                                sseHooks.callHook("sse:containerStats", formatStats(containerStats));
                                            }
                                        });
                                    })
                                })
                            }
                        }
                    }
                )
            }
        },
    )
}