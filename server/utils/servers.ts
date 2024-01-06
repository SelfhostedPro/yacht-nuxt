import { Config } from "../plugins/01.startup"
import type { ServerConfig } from "~/types/config"
import type { ServerDict } from "~/types/servers"
import type { EventHandlerRequest, H3Event } from 'h3'
import Docker from 'dockerode';

const getServers = async () => {
  return Config.getConfig().then(async (config) => {
    // console.log('config', config)
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
        const newLocal = await createDockerInstance(server);
        if (newLocal) {
          returnServers[server.name] = newLocal;
        }
      }
    })
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
    throw createError({ statusCode: 500, statusMessage: `Error connecting to ${server.name} (${server.options?.host && server.options.port ? server.options.host + ':' + server.options.port : server.options?.socketPath}) => ${e}` })
  }
}

// const ServerController = new Servers()
export default getServers