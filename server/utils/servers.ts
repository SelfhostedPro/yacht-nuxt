import { Config } from "../plugins/01.startup"
import type { YachtConfig, ServerConfig } from "~/types/config"
import type { ServerDict } from "~/types/servers"
import Docker from 'dockerode';


class Servers {
  servers: ServerDict = {}
  constructor() {
    this.getServers()
  }
  getServers = async () => {
    Config.getConfig().then(async (config) => {
      console.log('config', config)
      const servers = config.base.servers
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
          const newLocal = await this.createDockerInstance(server);
          if (newLocal) {
            this.servers[server.name] = newLocal;
          }
        }
      })
      await Promise.all(serverPromises);
    })
  }
  createDockerInstance = async (server: ServerConfig, privateKey?: string) => {
    const options = privateKey ? { ...server.options, sshOptions: { privateKey } } : server.options;
    // @ts-ignore
    const newServer = new Docker(options);
    try {
      await newServer.info();
      return newServer;
    } catch (e) {
      console.log(`Error connecting to ${server.name} (${server.options?.host && server.options.port ? server.options.host + ':' + server.options.port : server.options?.socketPath}) => ${e}`);
      return null;
    }
  }
}

const ServerController = new Servers()
export default ServerController