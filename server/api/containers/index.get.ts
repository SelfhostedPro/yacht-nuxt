import Docker from 'dockerode'
import ServerController from '~/server/utils/servers'
import type { Container } from '~/types/containers/yachtContainers'
import { normalizeContainers } from '~/server/utils/formatter'
import type { ServerContainers } from '~/types/servers'

export default defineEventHandler(async () => {
    try {
        const servers = ServerController.servers
        const serverKeys = Object.keys(servers)

        // Get containers from all servers in config
        const serverPromises: Promise<Container[]>[] = serverKeys.map(
            async (name) => {
                const containers = await servers[name]
                    .listContainers({ all: true })
                    .catch((error) => {
                        console.error(
                            `Error getting containers for server '${name}': ${error.message}`,
                        );
                        return [];
                    });
                return normalizeContainers(containers);
            },
        )
        // Wait for containers to resolve
        const containerArrays = await Promise.all(serverPromises);

        // Assign each container array to its server
        return serverKeys.reduce((acc, serverName, index) => {
            acc[serverName] = containerArrays[index];
            return acc;
        }, {} as ServerContainers);
    } catch (error) {
        console.error(`Error getting containers: ${(error as Error).message}`);
        throw new Error(`Error getting containers: ${(error as Error).message}`);
    }
})