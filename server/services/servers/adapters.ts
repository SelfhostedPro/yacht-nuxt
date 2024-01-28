import { type ServerConfig } from "~/types/config";
import { getPrivateKey } from "./keys";
import Docker from 'dockerode';

export const sshAdapter = async (server: ServerConfig) => {
    if (!server.key) throw new Error(`SSH key not found in ${server.name} config!`);
    const privateKey = await getPrivateKey(server.key);
    const options = { ...server.options, sshOptions: { privateKey } }
    try {
        //@ts-expect-error - Dockerode type missing the fact you can pass decrypted key as string
        const newServer = new Docker(options)
        const serverWorks = await newServer.info().catch((e) => {
            YachtError(e, '/services/servers/adapters - sshAdapter')
            return false
        })
        if (serverWorks === false) return null
        return newServer
    } catch (e) {
        YachtError(e, '/services/servers/adapters - sshAdapter#2')
        return null
    }
}

export const localAdapter = async (server: ServerConfig) => {
    try {
        //@ts-expect-error - Dockerode type missing the fact you can pass decrypted key as string
        const newServer = new Docker(server.options)
        const serverWorks = await newServer.info().catch((e) => {
            YachtError(e, '/services/servers/adapters - localAdapter')
            return false
        })
        if (serverWorks === false) return null
        return newServer
    } catch (e) {
        YachtError(e, '/services/servers/adapters - localAdapter#2')
        return null
    }
}