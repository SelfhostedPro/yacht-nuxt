import Docker from 'dockerode'
import { z } from 'zod'
import { containerSchema } from "~/types/containers/yachtContainers"
import type { Container } from "~/types/containers/yachtContainers"

export const ServerDictSchema = z.record(z.instanceof(Docker))
export type ServerDict = z.infer<typeof ServerDictSchema>

export const ServerContainersSchema = z.record(containerSchema)
export type ServerContainers = {
    [key: string]: Container[]
}