import { z } from 'zod'

// START: Container Schemas that yacht uses to display more readable information
const containerGeneralConfigSchema = z.object({
    hostname: z.string(),
    tty: z.boolean(),
    user: z.string(),
    appArmorProfile: z.string(),
    platform: z.string(),
    driver: z.string(),
    path: z.string(),
    args: z.array(z.string()),
    autoRemove: z.boolean(),
    capabilities: z.object({
        add: z.array(z.string()),
        remove: z.array(z.string())
    }),
    logConfig: z.object({
        type: z.string(),
        config: z.any()
    })
})
export type ContainerGeneralConfig = z.infer<typeof containerGeneralConfigSchema>

const containerMountSchema = z.object({
    type: z.string().optional(),
    name: z.string().optional(),
    source: z.string(),
    destination: z.string(),
    driver: z.string().optional(),
    mode: z.string(),
    rw: z.boolean(),
    propagation: z.string()
})
export type ContainerMount = z.infer<typeof containerMountSchema>

const containerPortSchema = z.object({
    containerPort: z.number(),
    hostPort: z.number().optional(),
    hostIP: z.string().optional(),
    type: z.string().optional()
})
export type ContainerPort = z.infer<typeof containerPortSchema>

const iPAMConfigSchema = z.object({
    ipv4Address: z.string().optional(),
    ipv6Address: z.string().optional(),
    linkLocalIps: z.array(z.string()).optional()
})
export type IPAMConfig = z.infer<typeof iPAMConfigSchema>

const NetworkInfoSchema = z.object({
    IPAMConfig: iPAMConfigSchema.optional(),
    Links: z.any().optional(),
    Aliases: z.any().optional(),
    NetworkID: z.string(),
    EndpointID: z.string(),
    Gateway: z.string(),
    IPAddress: z.string(),
    IPPrefixLen: z.number(),
    IPv6Gateway: z.string(),
    GlobalIPv6Address: z.string(),
    GlobalIPv6PrefixLen: z.number(),
    MacAddress: z.string()
})
export type NetworkInfo = z.infer<typeof NetworkInfoSchema>

const containerNetworkSettingsSchema = z.object({
    mode: z.string(),
    macAddress: z.string().optional(),
    hairpinmode: z.boolean().optional(),
    networks: z.record(NetworkInfoSchema)
})
export type ContainerNetworkSettings = z.infer<typeof containerNetworkSettingsSchema>

export const containerOciInfoSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    docs: z.string().optional(),
    url: z.string().optional(),
    source: z.string().optional(),
    vendor: z.string().optional(),
    icon: z.string().optional(),
    notes: z.string().optional(),
    external: z.string().optional(),
    subdomain: z.string().optional(),
})
export type ContainerOciInfo = z.infer<typeof containerOciInfoSchema>

const containerSchema = z.object({
    name: z.string(),
    id: z.string(),
    image: z.string(),
    shortId: z.string(),
    created: z.string(),
    status: z.string(),
    state: z.string().optional(),
    info: containerOciInfoSchema,
    restart: z.object({
        policy: z.string().optional(),
        count: z.number()
    }).optional(),
    config: z.object({
        network: containerNetworkSettingsSchema,
        general: containerGeneralConfigSchema.optional()
    }),
    mounts: z.array(containerMountSchema).optional(),
    ports: z.array(containerPortSchema).optional(),
    env: z.array(z.string()).optional(),
    labels: z.record(z.string()).optional(),
})
export type Container = z.infer<typeof containerSchema>
// END: Container Schemas that yacht uses to display more readable information

export const containerStatSchema = z.object({
    name: z.string(),
    memoryPercentage: z.string(),
    cpuUsage: z.string()
})
// export type ContainerStat = z.infer<typeof containerStatSchema>

export interface ContainerStats {
    [key: string]: ContainerStat
}

export interface ContainerStat {
    name: string,
    memoryPercentage: string,
    cpuUsage: string
}

// const containerStatsSchema = z.record(z.string(), containerStatSchema)
// export type ContainerStats = z.infer<typeof containerStatsSchema>


export { containerSchema }