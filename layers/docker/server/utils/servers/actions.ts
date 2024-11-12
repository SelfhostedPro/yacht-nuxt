import type { ServerDict } from "#docker/types/servers"

// Service Dependency Imports
import { sshAdapter, localAdapter } from "./adapters";
import { useConfig } from "#config/server/utils/config";

let _servers: ServerDict

export const useServers = async () => {
    // Disable caching for now.
    // if (!_servers) 
    _servers = await getServers()
    return _servers
}

export const getServer = async (name: string) => {
    const servers = await getServers()
    return servers[name]
}

const getServers = async () => {
    return useConfig().then(async (config) => {
        const servers = config.servers
        const returnServers = {} as ServerDict
        if (!servers) throw createError('No servers defined in config')
        const serverPromises = servers.map(async (server) => {
            if (server && server.options) switch (server.options?.protocol) {
                case 'ssh':
                    await sshAdapter(server).then((serverAdapter) => {
                        if (serverAdapter) returnServers[server.name] = serverAdapter
                    })
                    break;
                default:
                    await localAdapter(server).then((serverAdapter) => {
                        if (serverAdapter) returnServers[server.name] = serverAdapter
                    })
                    break;
            } else {
                await localAdapter(server).then((serverAdapter) => {
                    if (serverAdapter) returnServers[server.name] = serverAdapter
                })
            }
        })
        await Promise.all(serverPromises);
        return returnServers
    })
}

