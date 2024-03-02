import type { ServerConfig } from "~/types/config"
import type { ServerDict } from "~/types/servers"
import Docker from 'dockerode';

// Service Dependency Imports
import { sshAdapter, localAdapter } from "./adapters";

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
            if (server.options) switch (server.options?.protocol) {
                case 'ssh':
                    returnServers[server.name] = await sshAdapter(server);
                    break;
                default:
                    returnServers[server.name] = await localAdapter(server)
                    break;
            } else {
                returnServers[server.name] = await localAdapter(server)
            }
        }
        )
        await Promise.all(serverPromises);
        return returnServers
    })
}

