import { z } from "zod"
import { containerOciInfoSchema } from "./yachtContainers"
import { keyValueSchema, capAddSchema, capDropSchema, nameValueSchema } from "../shared"

export const containerFormEnvsSchema = z.object({
    name: z.string().optional(),
    value: z.string().optional(),
    description: z.string().optional(),
    label: z.string().optional()
})

export const containerFormUnchangableSchema = z.object({
    property: z.union([
        z.literal("host"),
        z.literal("container"),
        z.literal("protocol")
    ])
})

export const containerFormPortsSchema = z.object({
    label: z.string().optional(),
    host: z.string().optional(),
    container: z.string().optional(),
    protocol: z.union([z.literal("tcp"), z.literal("udp")]).optional(),
    description: z.string().optional(),
    unchangable: z
        .union([z.boolean(), z.array(containerFormUnchangableSchema)])
        .optional()
})

export const containerFormVolumesSchema = z.object({
    label: z.string().optional(),
    source: z.string().optional(),
    destination: z.string().optional(),
    read_only: z.boolean().optional()
})

export const networkModesSchema = z.object({
    network_modes: z.union([
        z.literal("bridge"),
        z.literal("host"),
        z.literal("none")
    ])
})

export const devicesSchema = z.object({
    host: z.string().optional(),
    container: z.string().optional(),
    permissions: z.union([
        z.literal('r'),
        z.literal('w'),
        z.literal('m'),
        z.literal('mw'),
        z.literal('rm'),
        z.literal('rwm'),
        z.literal('rw'),
    ]).optional()
})


export const createContainerFormSchema = z.object({
    name: z.string().optional(),
    image: z.string(),
    info: containerOciInfoSchema.optional(),
    restart: z.string().optional(),
    server: z.string(),
    network: z.string().optional(),
    network_mode: z.string().optional(),
    mounts: z.array(containerFormVolumesSchema).optional(),
    ports: z.array(containerFormPortsSchema).optional(),
    env: z.array(containerFormEnvsSchema).optional(),
    labels: z.array(nameValueSchema).optional(),
    command: z.array(z.string()).optional(),
    devices: z.array(devicesSchema).optional(),
    sysctls: z.array(nameValueSchema).optional(),
    capabilities: z
        .object({
            add: z.array(capAddSchema).optional(),
            drop: z.array(capDropSchema).optional()
        })
        .optional(),
    limits: z
        .object({
            cpus: z.number().optional(),
            mem_limit: z.number().optional()
        })
        .optional()
})

export type CreateContainerForm = z.infer<typeof createContainerFormSchema>