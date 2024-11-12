import { z } from 'zod'

// Rebuilding Dockerode types as zod schemas.
// Used https://transform.tools/typescript-to-zod to simplify this.

export const portSchema = z.object({
    IP: z.string(),
    PrivatePort: z.number(),
    PublicPort: z.number(),
    Type: z.string()
})

export type Port = z.infer<typeof portSchema>

export const networkInfoSchema = z.object({
    IPAMConfig: z.any().optional(),
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

export const containerInfoSchema = z.object({
    Id: z.string(),
    Names: z.array(z.string()),
    Image: z.string(),
    ImageID: z.string(),
    Command: z.string(),
    Created: z.number(),
    Ports: z.array(portSchema),
    Labels: z.record(z.string()),
    State: z.string(),
    Status: z.string(),
    HostConfig: z.object({
        NetworkMode: z.string()
    }),
    NetworkSettings: z.object({
        Networks: z.record(networkInfoSchema)
    }),
    Mounts: z.array(
        z.object({
            Name: z.string().optional(),
            Type: z.string(),
            Source: z.string(),
            Destination: z.string(),
            Driver: z.string().optional(),
            Mode: z.string(),
            RW: z.boolean(),
            Propagation: z.string()
        })
    )
})

export type ContainerInfo = z.infer<typeof containerInfoSchema>

const hostRestartPolicySchema = z.object({
    Name: z.string(),
    MaximumRetryCount: z.union([z.number(), z.undefined()]).optional()
})

const deviceRequestSchema = z.object({
    Driver: z.union([z.string(), z.undefined()]).optional(),
    Count: z.union([z.number(), z.undefined()]).optional(),
    DeviceIDs: z.union([z.array(z.string()), z.undefined()]).optional(),
    Capabilities: z
        .union([z.array(z.array(z.string())), z.undefined()])
        .optional(),
    Options: z.union([z.record(z.string()), z.undefined()]).optional()
})

const mountTypeSchema = z.union([
    z.literal("bind"),
    z.literal("volume"),
    z.literal("tmpfs")
])

const mountConsistencySchema = z.union([
    z.literal("default"),
    z.literal("consistent"),
    z.literal("cached"),
    z.literal("delegated")
])

const mountPropagationSchema = z.union([
    z.literal("private"),
    z.literal("rprivate"),
    z.literal("shared"),
    z.literal("rshared"),
    z.literal("slave"),
    z.literal("rslave")
])

const mountSettingsSchema = z.object({
    Target: z.string(),
    Source: z.string(),
    Type: mountTypeSchema,
    ReadOnly: z.union([z.boolean(), z.undefined()]).optional(),
    Consistency: z.union([mountConsistencySchema, z.undefined()]).optional(),
    BindOptions: z
        .union([
            z.object({
                Propagation: mountPropagationSchema
            }),
            z.undefined()
        ])
        .optional(),
    VolumeOptions: z
        .union([
            z.object({
                NoCopy: z.boolean(),
                Labels: z.record(z.string()),
                DriverConfig: z.object({
                    Name: z.string(),
                    Options: z.record(z.string())
                })
            }),
            z.undefined()
        ])
        .optional(),
    TmpfsOptions: z
        .union([
            z.object({
                SizeBytes: z.number(),
                Mode: z.number()
            }),
            z.undefined()
        ])
        .optional()
})

const mountConfigSchema = z.array(mountSettingsSchema)

const hostConfigSchema = z.object({
    AutoRemove: z.union([z.boolean(), z.undefined()]).optional(),
    Binds: z.union([z.array(z.string()), z.undefined()]).optional(),
    ContainerIDFile: z.union([z.string(), z.undefined()]).optional(),
    LogConfig: z
        .union([
            z.object({
                Type: z.string(),
                Config: z.any()
            }),
            z.undefined()
        ])
        .optional(),
    NetworkMode: z.union([z.string(), z.undefined()]).optional(),
    PortBindings: z.any().optional(),
    RestartPolicy: z.union([hostRestartPolicySchema, z.undefined()]).optional(),
    VolumeDriver: z.union([z.string(), z.undefined()]).optional(),
    VolumesFrom: z.any().optional(),
    Mounts: z.union([mountConfigSchema, z.undefined()]).optional(),
    CapAdd: z.any().optional(),
    CapDrop: z.any().optional(),
    Dns: z.union([z.array(z.any()), z.undefined()]).optional(),
    DnsOptions: z.union([z.array(z.any()), z.undefined()]).optional(),
    DnsSearch: z.union([z.array(z.string()), z.undefined()]).optional(),
    ExtraHosts: z.any().optional(),
    GroupAdd: z.union([z.array(z.string()), z.undefined()]).optional(),
    IpcMode: z.union([z.string(), z.undefined()]).optional(),
    Cgroup: z.union([z.string(), z.undefined()]).optional(),
    Links: z.any().optional(),
    OomScoreAdj: z.union([z.number(), z.undefined()]).optional(),
    PidMode: z.union([z.string(), z.undefined()]).optional(),
    Privileged: z.union([z.boolean(), z.undefined()]).optional(),
    PublishAllPorts: z.union([z.boolean(), z.undefined()]).optional(),
    ReadonlyRootfs: z.union([z.boolean(), z.undefined()]).optional(),
    SecurityOpt: z.any().optional(),
    StorageOpt: z.union([z.record(z.string()), z.undefined()]).optional(),
    Tmpfs: z.union([z.record(z.string()), z.undefined()]).optional(),
    UTSMode: z.union([z.string(), z.undefined()]).optional(),
    UsernsMode: z.union([z.string(), z.undefined()]).optional(),
    ShmSize: z.union([z.number(), z.undefined()]).optional(),
    Sysctls: z.union([z.record(z.string()), z.undefined()]).optional(),
    Runtime: z.union([z.string(), z.undefined()]).optional(),
    ConsoleSize: z.union([z.array(z.number()), z.undefined()]).optional(),
    Isolation: z.union([z.string(), z.undefined()]).optional(),
    MaskedPaths: z.union([z.array(z.string()), z.undefined()]).optional(),
    ReadonlyPaths: z.union([z.array(z.string()), z.undefined()]).optional(),
    CpuShares: z.union([z.number(), z.undefined()]).optional(),
    CgroupParent: z.union([z.string(), z.undefined()]).optional(),
    BlkioWeight: z.union([z.number(), z.undefined()]).optional(),
    BlkioWeightDevice: z.any().optional(),
    BlkioDeviceReadBps: z.any().optional(),
    BlkioDeviceWriteBps: z.any().optional(),
    BlkioDeviceReadIOps: z.any().optional(),
    BlkioDeviceWriteIOps: z.any().optional(),
    CpuPeriod: z.union([z.number(), z.undefined()]).optional(),
    CpuQuota: z.union([z.number(), z.undefined()]).optional(),
    CpusetCpus: z.union([z.string(), z.undefined()]).optional(),
    CpusetMems: z.union([z.string(), z.undefined()]).optional(),
    Devices: z.any().optional(),
    DeviceCgroupRules: z.union([z.array(z.string()), z.undefined()]).optional(),
    DeviceRequests: z
        .union([z.array(deviceRequestSchema), z.undefined()])
        .optional(),
    DiskQuota: z.union([z.number(), z.undefined()]).optional(),
    KernelMemory: z.union([z.number(), z.undefined()]).optional(),
    Memory: z.union([z.number(), z.undefined()]).optional(),
    MemoryReservation: z.union([z.number(), z.undefined()]).optional(),
    MemorySwap: z.union([z.number(), z.undefined()]).optional(),
    MemorySwappiness: z.union([z.number(), z.undefined()]).optional(),
    NanoCpus: z.union([z.number(), z.undefined()]).optional(),
    OomKillDisable: z.union([z.boolean(), z.undefined()]).optional(),
    Init: z.union([z.boolean(), z.undefined()]).optional(),
    PidsLimit: z.union([z.number(), z.undefined()]).optional(),
    Ulimits: z.any().optional(),
    CpuCount: z.union([z.number(), z.undefined()]).optional(),
    CpuPercent: z.union([z.number(), z.undefined()]).optional(),
    CpuRealtimePeriod: z.union([z.number(), z.undefined()]).optional(),
    CpuRealtimeRuntime: z.union([z.number(), z.undefined()]).optional()
})

export const containerInspectInfoSchema = z.object({
    Id: z.string(),
    Created: z.string(),
    Path: z.string(),
    Args: z.array(z.string()),
    State: z.object({
        Status: z.string(),
        Running: z.boolean(),
        Paused: z.boolean(),
        Restarting: z.boolean(),
        OOMKilled: z.boolean(),
        Dead: z.boolean(),
        Pid: z.number(),
        ExitCode: z.number(),
        Error: z.string(),
        StartedAt: z.string(),
        FinishedAt: z.string(),
        Health: z
            .union([
                z.object({
                    Status: z.string(),
                    FailingStreak: z.number(),
                    Log: z.array(
                        z.object({
                            Start: z.string(),
                            End: z.string(),
                            ExitCode: z.number(),
                            Output: z.string()
                        })
                    )
                }),
                z.undefined()
            ])
            .optional()
    }),
    Image: z.string(),
    ResolvConfPath: z.string(),
    HostnamePath: z.string(),
    HostsPath: z.string(),
    LogPath: z.string(),
    Name: z.string(),
    RestartCount: z.number(),
    Driver: z.string(),
    Platform: z.string(),
    MountLabel: z.string(),
    ProcessLabel: z.string(),
    AppArmorProfile: z.string(),
    ExecIDs: z.union([z.array(z.string()), z.undefined()]).optional(),
    HostConfig: hostConfigSchema,
    GraphDriver: z.object({
        Name: z.string(),
        Data: z.object({
            DeviceId: z.string(),
            DeviceName: z.string(),
            DeviceSize: z.string()
        })
    }),
    Mounts: z.array(
        z.object({
            Name: z.union([z.string(), z.undefined()]).optional(),
            Source: z.string(),
            Destination: z.string(),
            Mode: z.string(),
            RW: z.boolean(),
            Propagation: z.string()
        })
    ),
    Config: z.object({
        Hostname: z.string(),
        Domainname: z.string(),
        User: z.string(),
        AttachStdin: z.boolean(),
        AttachStdout: z.boolean(),
        AttachStderr: z.boolean(),
        ExposedPorts: z.record(z.object({})),
        Tty: z.boolean(),
        OpenStdin: z.boolean(),
        StdinOnce: z.boolean(),
        Env: z.array(z.string()),
        Cmd: z.array(z.string()),
        Image: z.string(),
        Volumes: z.record(z.object({})),
        WorkingDir: z.string(),
        Entrypoint: z
            .union([z.string(), z.array(z.string()), z.undefined()])
            .optional(),
        OnBuild: z.any().optional(),
        Labels: z.record(z.string(), z.string())
    }),
    NetworkSettings: z.object({
        Bridge: z.string(),
        SandboxID: z.string(),
        HairpinMode: z.boolean(),
        LinkLocalIPv6Address: z.string(),
        LinkLocalIPv6PrefixLen: z.number(),
        Ports: z.record(
            z.array(
                z.object({
                    HostIp: z.string(),
                    HostPort: z.string()
                })
            )
        ),
        SandboxKey: z.string(),
        SecondaryIPAddresses: z.any().optional(),
        SecondaryIPv6Addresses: z.any().optional(),
        EndpointID: z.string(),
        Gateway: z.string(),
        GlobalIPv6Address: z.string(),
        GlobalIPv6PrefixLen: z.number(),
        IPAddress: z.string(),
        IPPrefixLen: z.number(),
        IPv6Gateway: z.string(),
        MacAddress: z.string(),
        Networks: z.record(
            z.object({
                IPAMConfig: z.any().optional(),
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
        ),
        Node: z
            .union([
                z.object({
                    ID: z.string(),
                    IP: z.string(),
                    Addr: z.string(),
                    Name: z.string(),
                    Cpus: z.number(),
                    Memory: z.number(),
                    Labels: z.any()
                }),
                z.undefined()
            ])
            .optional()
    })
})

export type ContainerInspectInfo = z.infer<typeof containerInspectInfoSchema>
