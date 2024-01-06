import Docker from 'dockerode'
import getServers from '~/server/utils/servers'
import type { Container } from '~/types/containers/yachtContainers'
import { normalizeContainers } from '~/server/utils/formatter'
import type { ServerContainers } from '~/types/servers'

export default defineEventHandler(async () => {
    const servers = await getServers()
    const serverKeys = Object.keys(servers)

    // Get containers from all servers in config
    const serverPromises: Promise<Container[]>[] = serverKeys.map(
        async (name) => {
            const containers = await servers[name]
                .listContainers({ all: true })
            return normalizeContainers(containers);
        },
    )
    // Wait for containers to resolve
    const containerArrays = await Promise.all(serverPromises)

    // Assign each container array to its server
    return serverKeys.reduce((acc, serverName, index) => {
        acc[serverName] = containerArrays[index];
        return acc;
    }, {} as ServerContainers);
})