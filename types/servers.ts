import Docker from 'dockerode'
import { z } from 'zod'
import { containerSchema } from "~/types/containers/yachtContainers"
import type { Container } from "~/types/containers/yachtContainers"

export const ServerDictSchema = z.record(z.instanceof(Docker).nullable())
export type ServerDict = z.infer<typeof ServerDictSchema>

export const ServerContainersSchema = z.record(containerSchema)
export type ServerContainers = {
    [key: string]: Container[]
}

// Resources
export type ServerImages = {
    [key: string]: Docker.ImageInfo[]
}
export type ServerVolumes = {
    [key: string]: Docker.VolumeInspectInfo[]
}
export type ServerNetworks = {
    [key: string]: Docker.NetworkInspectInfo[]
}