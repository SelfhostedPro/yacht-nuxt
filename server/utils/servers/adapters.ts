import type { ServerSettings } from "~~/modules/config/types/server";
import { getPrivateKey } from "./keys";
import Docker from 'dockerode';

export const sshAdapter = async (server: ServerSettings) => {
    if (!server.key) throw new Error(`SSH key not found in ${server.name} config!`);
    const privateKey = await getPrivateKey(server.key);
    const options = { ...server.options, sshOptions: { privateKey } }
    //@ts-expect-error - Dockerode type missing the fact you can pass decrypted key as string
    const newServer = new Docker(options)
    const serverWorks = await newServer.info().catch((e) => {
        createError(e)
        return false
    })
    if (serverWorks === false) return
    return newServer
}

export const localAdapter = async (server: ServerSettings) => {
    //@ts-expect-error - Dockerode type missing the fact you can pass decrypted key as string
    const newServer = new Docker(server.options)
    const serverWorks = await newServer.info().catch((e) => {
        createError(e)
        return false
    })
    if (serverWorks === false) return
    return newServer
}