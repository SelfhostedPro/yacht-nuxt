import type { ServerSettings } from "~~/modules/config/types/server";
import { getPrivateKey } from "./manager";
import Docker from 'dockerode';

const createDockerInstance = async (options: Docker.DockerOptions): Promise<Docker | undefined> => {
    const newServer = new Docker(options);
    try {
        await newServer.info();
        return newServer;
    } catch (e) {
        createError(e as string);
        return undefined;
    }
};

export const sshAdapter = async (server: ServerSettings): Promise<Docker | undefined> => {
    if (!server.key) {
        throw new Error(`SSH key not found in ${server.name} config!`);
    }
    const privateKey = await getPrivateKey(server.key);
    if (!privateKey) {
        throw new Error(`SSH key not found in ${server.name} config!`);
    }
    const { key, passphrase } = privateKey;

    const options = { ...server.options, sshOptions: { privateKey: key, passphrase, debug: null } };
    // @ts-expect-error - Dockerode type missing the fact you can pass decrypted key as string
    return createDockerInstance(options);
};

export const localAdapter = async (server: ServerSettings): Promise<Docker | undefined> => {
    // @ts-expect-error - Dockerode type missing the fact you can pass decrypted key as string
    return createDockerInstance(server.options);
};
