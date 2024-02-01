import type { ServerVolumes, ServerImages, ServerNetworks } from "~/types/servers";
import type { ImageInspectInfo, ImageInfo, VolumeInspectInfo, NetworkInspectInfo } from 'dockerode'

// Service Dependency Imports
import { useServers, getServer } from '../servers'

export const getImages = async (): Promise<ServerImages> => {
    const serversReturn = {} as ServerImages
    const servers = Object.entries(await useServers())

    // Get containers from all servers in config
    const serverPromises = servers.map(
        async ([server, docker]) => {
            const images = await docker?.listImages({ all: true, digests: true }).catch((e) => {
                YachtError(e, '/services/resources - getImages')
                return undefined
            })
            if (images !== undefined) serversReturn[server] = images
            else serversReturn[server] = [] as ImageInfo[]
        },
    )
    await Promise.all(serverPromises)
    return serversReturn
}

export const getImage = async (serverName: string, id: string): Promise<ImageInspectInfo> => {
    const server = await getServer(serverName)
    if (!server) throw YachtError(new Error(`Server ${server} not found!`), '/services/resources/info - getImage')
    return await server.getImage(id).inspect();
}

export const getVolumes = async (): Promise<ServerVolumes> => {
    const serversReturn = {} as ServerVolumes
    const servers = Object.entries(await useServers())

    // Get containers from all servers in config
    const serverPromises = servers.map(
        async ([server, docker]) => {
            const volumes = await docker?.listVolumes({ all: true }).then((volumes) => volumes.Volumes).catch((e) => {
                YachtError(e, '/services/resources - getVolumes')
                return undefined
            })
            if (volumes !== undefined) serversReturn[server] = volumes
            else serversReturn[server] = [] as VolumeInspectInfo[]
        }
    );
    // Wait for containers to resolve
    await Promise.all(serverPromises);
    return serversReturn
}

export const getVolume = async (serverName: string, id: string): Promise<VolumeInspectInfo> => {
    const server = await getServer(serverName)
    if (!server) throw YachtError(new Error(`Server ${server} not found!`), '/services/resources/info - getVolume')
    return await server.getVolume(id).inspect();
}

export const getNetworks = async (): Promise<ServerNetworks> => {
    const serversReturn = {} as ServerNetworks
    const servers = Object.entries(await useServers())

    // Get containers from all servers in config
    const serverPromises = servers.map(
        async ([server, docker]) => {
            const networks = await docker?.listNetworks({ all: true }).catch((e) => {
                YachtError(e, '/services/resources - getNetworks')
                return undefined
            })
            if (networks !== undefined) serversReturn[server] = networks
            else serversReturn[server] = [] as NetworkInspectInfo[]
        }
    );
    // Wait for containers to resolve
    await Promise.all(serverPromises);
    return serversReturn
}

export const getNetwork = async (serverName: string, id: string): Promise<NetworkInspectInfo> => {
    const server = await getServer(serverName)
    if (!server) throw YachtError(new Error(`Server ${server} not found!`), '/services/resources/info - getNetwork')
    return await server?.getNetwork(id).inspect();
}