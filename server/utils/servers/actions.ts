// Import necessary types and dependencies
import type { NewServerOptions } from "~~/types/forms/server"
import type { ServerDict } from "~~/types/servers"
import Docker from 'dockerode';
import { randomBytes } from 'crypto';

// Import service dependencies
import { sshAdapter, localAdapter } from "./adapters";
import { copyPublicKeyToRemoteServer, createSSHKey, removeSSHKey, removePublicKeyFromRemoteServer, getAllKeys } from './manager'

// Initialize variables
let _servers: ServerDict
const nuxtConfig = useRuntimeConfig()

// Export getAllKeys function
export { getAllKeys }

// Function to get and cache servers
export const useServers = async () => {
    _servers = await getServers()
    return _servers
}

// Function to get a specific server by name
export const getServer = async (name: string) => {
    const servers = await getServers()
    return servers[name]
}

// Function to fetch and process all servers from the config
const getServers = async () => {
    const config = await useConfig()
    const { servers } = config
    if (!servers) throw createError('No servers defined in config')
    
    const returnServers: ServerDict = {}
    
    await Promise.all(servers.map(async (server) => {
        const adapter = server.options?.protocol === 'ssh' ? sshAdapter : localAdapter
        const serverAdapter = await adapter(server)
        if (serverAdapter) returnServers[server.name] = serverAdapter
    }))
    
    return returnServers
}

// Function to remove a server from the config
export const removeServer = async (name: string, removeRemoteKey: boolean, removeLocalKey: boolean) => {
    const config = await useConfig()
    const serverIndex = config.servers.findIndex((server) => server.name === name)
    const serverToRemove = config.servers[serverIndex]

    if (!serverToRemove) {
        throw createError(`Server ${name} not found in config`)
    }

    Logger.warn(`Removing server ${name} (${serverToRemove.options?.host && serverToRemove.options.port
        ? `${serverToRemove.options.host}:${serverToRemove.options.port}`
        : serverToRemove.options?.socketPath})`)

    const { key, options } = serverToRemove
    
    if (removeRemoteKey && options && key) {
        const { host, port, username } = options
        if (!host || !port || !username) {
            throw Error(`Missing required options for server ${name}`)
        }
        await removePublicKeyFromRemoteServer(key, host, port, username)
    }
    
    if (removeLocalKey && key) {
        await removeSSHKey(key)
    }
    
    config.servers.splice(serverIndex, 1)
    await updateConfig(config, nuxtConfig.yacht.configOptions.configPath)
    return config.servers
}

// Function to add a new server to the config
export const addServerToConfig = async (
    name: string,
    options: NewServerOptions,
    keyName?: string,
    copyToServer?: boolean,
) => {
    const config = await useConfig()
    const servers = config.servers
    
    // Check if server already exists
    Logger.info(`Checking if server ${name} already exists`);
    const serverExists = servers.findIndex((server) => server.name === name) !== -1
    if (serverExists) {
        Logger.error('Server already exists');
        throw Error('Server already exists');
    }
    
    // Check if the key already exists
    const currentKeys = await getAllKeys();
    const keyExists = keyName && currentKeys.includes(keyName);

    // Validate required options for SSH protocol
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

    // Generate and copy SSH key if necessary
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
        // Generate SSH key without copying to server
        Logger.info(`Generating SSH key for ${name}`);
        await createSSHKey(
            keyName,
            randomBytes(32).toString('hex'),
        );
    } else if (options.protocol === 'ssh' && keyName && copyToServer) {
        // Copy existing key to server
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
    
    // Remove password from options for security
    delete options.password;
    
    // Add new server to config
    config.servers.push({ name, options, key: keyName });

    // Update and save config
    return updateConfig(config, nuxtConfig.yacht.configOptions.configPath);
}
