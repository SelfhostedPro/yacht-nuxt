import type { ServerConfig } from "~/types/config"
import type { ServerDict } from "~/types/servers"
import Docker from 'dockerode';

// Service Dependency Imports
import { useConfig } from "../config"


let _servers: ServerDict

export const useServers = async () => {
  if (!_servers) {
    _servers = await getServers()
  }
  return _servers
}

export const getServer = async (name: string) => {
  const servers = await getServers()
  return servers[name]
}

export const getServers = async () => {
  return useConfig().then(async (config) => {
    const servers = config.base.servers
    const returnServers = {} as ServerDict
    const serverPromises = servers.map(async (server) => {
      if (server.options?.protocol === 'ssh' && server.key) {
        console.log('SSH Not implemented yet')
        // const privateKey = await this.keyManager.getPrivateKey(server.key);
        // const newServer = await this.createDockerInstance(server, privateKey);
        // if (newServer) {
        //   this.servers[server.name] = newServer;
        // }
      } else if (server.options?.protocol === 'ssh' && !server.key) {
        console.log('SSH Not implemented yet')
        console.log(`SSH key not found for ${server.name} please try removing and re-adding the server`);
      } else {
        try {
          const newLocal = await createDockerInstance(server);
          returnServers[server.name] = newLocal;
        } catch (e) {
          YachtError(e)
          returnServers[server.name] = null;
        }
      }
    }
    )
    await Promise.all(serverPromises);
    return returnServers
  })
}

const createDockerInstance = async (server: ServerConfig, privateKey?: string) => {
  const options = privateKey ? { ...server.options, sshOptions: { privateKey } } : server.options;
  // @ts-ignore
  const newServer = new Docker(options);
  try {
    await newServer.info();
    return newServer;
  } catch (e) {
    throw createError({ data: { title: 'DockerError', level: 'error', from: '/plugins/servers.ts - createDockerInstance', message: `Error connecting to ${server.name} (${server.options?.host && server.options.port ? server.options.host + ':' + server.options.port : server.options?.socketPath}) => ${e}` } })
  }
}

// const ServerController = new Servers()