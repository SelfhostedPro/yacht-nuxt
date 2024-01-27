import { type ServerConfig } from "~/types/config";
import { getPrivateKey } from "./keys";
import Docker from 'dockerode';

export const sshAdapter = async (server: ServerConfig) => {
    if (!server.key) throw new Error(`SSH key not found in ${server.name} config!`);
    const privateKey = await getPrivateKey(server.key);
    const options = { ...server.options, sshOptions: { privateKey } }
    try {
        //@ts-expect-error - Dockerode type missing the fact you can pass decrypted key as string
        return new Docker(options)
    } catch (e) {
        YachtError(e, '/services/servers/adapters - sshAdapter')
        return null
    }
}

export const localAdapter = async (server: ServerConfig) => {
    try {
        //@ts-expect-error - Dockerode type missing the fact you can pass decrypted key as string
        return new Docker(server.options)
    } catch (e) {
        YachtError(e, '/services/servers/adapters - sshAdapter')
        return null
    }
}