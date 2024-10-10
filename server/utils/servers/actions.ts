import type { ServerDict } from "~~/types/servers"
import Docker from 'dockerode';

// Service Dependency Imports
import { sshAdapter, localAdapter } from "./adapters";
import { useConfig } from "~~/modules/config/runtime/server/utils/config";

let _servers: ServerDict
const nuxtConfig = useRuntimeConfig()


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

export const removeServer = async (name: string, removeRemoteKey: boolean, removeLocalKey: boolean) => {
    const config = await useConfig()

    const serverIndex = config.servers.findIndex((server) => server.name == name)
    const serverToRemove = config.servers[serverIndex]

    if (serverToRemove) {
        Logger.warn(`Removing server ${name} (${serverToRemove.options?.host && serverToRemove.options.port
            ? `${serverToRemove.options.host}:${serverToRemove.options.port}`
            : serverToRemove.options?.socketPath})`);

        const { name: ServerName, key, options } = serverToRemove
        if (removeRemoteKey && options && key) {
            if (!options.host || !options.port || !options.username) {
                throw Error(`Missing required options for server ${ServerName}`);
            }
            removePublicKeyFromRemoteServer(key, options?.host, options?.port, options?.username);
        }
        if (removeLocalKey && options && key) {
            removeSSHKey(key);
        }
        delete config.servers[serverIndex];
        updateConfig(config, nuxtConfig.yacht.configOptions.configPath)
    } else {
        throw createError(`Server ${name} not found in config`);
    }
    return config.servers
}

