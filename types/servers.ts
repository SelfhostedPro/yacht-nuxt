import Docker from 'dockerode'
import { z } from 'zod'
import { containerSchema } from "~~/types/containers/yachtContainers"
import type { Container, ContainerStat } from "~~/types/containers/yachtContainers"
import type { ImageInfo } from 'dockerode'
import type { FixedVolumeInspectInfo } from './containers/fixedDockerode'
export const ServerDictSchema = z.record(z.instanceof(Docker))
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

export interface ContainerStats {
    name: string;
    cpuUsage: string;
    memoryPercentage: string;
}

export interface ServerStats {
    cpuTotal: number;
    memoryTotal: number;
    containers: {
        [containerName: string]: ContainerStats;
    };
}

export interface ServerStatsDict {
    [serverName: string]: ServerStats;
}

export interface DockerUsageInfo {
    LayersSize: number;
    Images: ImageInfo[];
    Containers: Container[];
    Volumes: FixedVolumeInspectInfo[];
}


export interface DockerSystemInfo {
    ID: string;
    Containers: number;
    ContainersRunning: number;
    ContainersPaused: number;
    ContainersStopped: number;
    Images: number;
    Driver: string;
    DriverStatus: [string, string][];
    SystemStatus?: [string, string][];
    Plugins: {
      Volume: string[];
      Network: string[];
      Authorization: string[];
      Log: string[];
    };
    MemoryLimit: boolean;
    SwapLimit: boolean;
    KernelMemory: boolean;
    CpuCfsPeriod: boolean;
    CpuCfsQuota: boolean;
    CPUShares: boolean;
    CPUSet: boolean;
    IPv4Forwarding: boolean;
    BridgeNfIptables: boolean;
    BridgeNfIp6tables: boolean;
    Debug: boolean;
    NFd: number;
    OomKillDisable: boolean;
    NGoroutines: number;
    SystemTime: string;
    LoggingDriver: string;
    CgroupDriver: string;
    NEventsListener: number;
    KernelVersion: string;
    OperatingSystem: string;
    OSType: string;
    Architecture: string;
    IndexServerAddress: string;
    RegistryConfig: {
      AllowNondistributableArtifactsCIDRs: string[];
      AllowNondistributableArtifactsHostnames: string[];
      InsecureRegistryCIDRs: string[];
      IndexConfigs: {
        [key: string]: {
          Name: string;
          Mirrors: string[];
          Secure: boolean;
          Official: boolean;
        };
      };
      Mirrors: string[];
    };
    NCPU: number;
    MemTotal: number;
    GenericResources: any[];
    DockerRootDir: string;
    HttpProxy: string;
    HttpsProxy: string;
    NoProxy: string;
    Name: string;
    Labels: string[];
    ExperimentalBuild: boolean;
    ServerVersion: string;
    ClusterStore: string;
    ClusterAdvertise: string;
    Runtimes: {
      [key: string]: {
        path: string;
      };
    };
    DefaultRuntime: string;
    Swarm: {
      NodeID: string;
      NodeAddr: string;
      LocalNodeState: string;
      ControlAvailable: boolean;
      Error: string;
      RemoteManagers?: {
        NodeID: string;
        Addr: string;
      }[];
    };
    LiveRestoreEnabled: boolean;
    Isolation: string;
    InitBinary: string;
    ContainerdCommit: {
      ID: string;
      Expected: string;
    };
    RuncCommit: {
      ID: string;
      Expected: string;
    };
    InitCommit: {
      ID: string;
      Expected: string;
    };
    SecurityOptions: string[];
    ProductLicense: string;
    DefaultAddressPools: {
      Base: string;
      Size: number;
    }[];
    Warnings: string[];
  }




