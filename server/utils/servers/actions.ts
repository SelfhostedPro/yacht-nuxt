import type { NewServerOptions, ServerDict } from "~~/types/servers"
import Docker from 'dockerode';
import { randomBytes } from 'crypto';

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

export const addServerToConfig = async (
    name: string,
    options: NewServerOptions,
    keyName?: string,
    copyToServer?: boolean,
) => {
    const config = await useConfig()
    const servers = config.servers
    // Check for existing servers
    Logger.info(`Checking if server ${name} already exists`);
    const serverExists = servers.findIndex((server) => server.name === name) !== -1
    if (serverExists) {
        Logger.error('Server already exists');
        throw Error('Server already exists');
    }
    const currentKeys = await getAllKeys();
    const keyExists = keyName && currentKeys.includes(keyName);

    if (options.protocol === 'ssh') {
        const requiredOptions = [options.host, options.port, options.username, options.password]
        const requiredOptionsNames = ['host', 'port', 'username', 'password']
        requiredOptions.forEach((option, i) => {
            if (option == undefined) {
                Logger.error(`Missing required option ${requiredOptionsNames[i]}`);
                throw Error(`Missing required option ${requiredOptionsNames[i]}`);
            }
        });
    }


    // Generate a new ssh key and copy it to the remote server
    if (options.protocol === 'ssh' && options.host && options.port && options.username && options.password && keyName && !keyExists && copyToServer) {
        // Generate random passphrase and create SSH key
        Logger.info(`Generating SSH key for ${name}`);
        await createSSHKey(keyName, randomBytes(32).toString('hex'));
        Logger.info(`Copying Public key ${keyName} to ${name}`)
        try {
            await copyPublicKeyToRemoteServer(
                keyName,
                options.host,
                options.port,
                options.username,
                options.password,
            );
        } catch (e) {
            Logger.info(`Error copying SSH key to ${name}: ${e}`);
            await removeSSHKey(keyName)
            throw new Error(`Error copying SSH key to ${name}: ${e}`);
        }
    } else if (
        options.protocol === 'ssh' &&
        keyName &&
        !keyExists &&
        !copyToServer
    ) {
        Logger.info(`Generating SSH key for ${name}`);
        await createSSHKey(
            keyName,
            randomBytes(32).toString('hex'),
        );
    } else if (options.protocol === 'ssh' && keyName && copyToServer) {
        try {
            await copyPublicKeyToRemoteServer(
                keyName,
                options.host!,
                options.port!,
                options.username!,
                options.password!,
            );
        } catch (e) {
            Logger.error(`Error copying SSH key to ${name}: ${e}`);
            await removeSSHKey(keyName);
            throw new Error(`Error copying SSH key to ${name}: ${e}`);
        }
    }
    delete options.password;
    config.servers.push({ name, options, key: keyName });

    return updateConfig(config, nuxtConfig.yacht.configOptions.configPath);

}