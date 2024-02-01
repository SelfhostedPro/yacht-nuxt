import type { Container, ContainerMount, ContainerPort, ContainerStat } from "~/types/containers/yachtContainers";
import type { FixedContainerInfo, FixedContainerInspectInfo } from "~/types/containers/fixedDockerode";
import type { Port, ContainerInspectInfo, ContainerInfo } from "~/types/containers/dockerode"
import { format, parseISO } from 'date-fns';
import { type CreateContainerForm } from "~/types/containers/create";
import type { ContainerCreateOptions, ContainerStats as DockerodeContainerStats } from "dockerode";
import { useConfig } from "../config";

/**
 * Checks to see if the icon url is valid and loads.
 * (Used in order to grab the default LSIO icon if the app's icon returns a 404)
 */
const checkUrl = async (url: string): Promise<string> => {
    const DEFAULT_IMAGE_URL = 'https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png';
    try {
        new URL(url);
        const response = await fetch(url);
        return response.ok && response.status !== 404 ? url : DEFAULT_IMAGE_URL;
    } catch {
        return DEFAULT_IMAGE_URL;
    }
}

/**
 * Checks for an icon url in the container's labels.
 * Includes some special cases for certain vendors.
 */
const getIconUrl = async (labels: Container['labels']) => {
    if (labels && labels['sh.yacht.icon']) {
        return checkUrl(labels['sh.yacht.icon']);
    }
    if (
        labels && labels['org.opencontainers.image.vendor'] &&
        labels['org.opencontainers.image.title']
    ) {
        const vendor = labels['org.opencontainers.image.vendor']?.toLowerCase();
        const title = labels['org.opencontainers.image.title']?.toLowerCase();
        switch (vendor) {
            case 'linuxserver.io': {
                const url = `https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/${title}-logo.png`;
                return await checkUrl(url);
            }
            case 'portainer.io': {
                return labels['com.docker.desktop.extension.icon']
            }
            default: {
                return labels['sh.yacht.icon']
            }
        }
    }
}

/**
 * Transform mounts data to ContainerMount type.
 */
const formatMounts = (data: FixedContainerInfo['Mounts'] | FixedContainerInspectInfo['Mounts']): ContainerMount[] => {
    return data.map(
        ({ Type, Name, Source, Destination, Driver, Mode, RW, Propagation }) => ({
            type: Type,
            name: Name,
            source: Source ?? null,
            destination: Destination ?? null,
            driver: Driver,
            mode: Mode,
            rw: RW,
            propagation: Propagation,
        }),
    );
}

/**
* Transform ports data from inspect to ContainerPort type.
*/
const formatInfoPorts = (data: Port[]): ContainerPort[] => {
    return data.reduce(
        (
            acc: ContainerPort[],
            { PrivatePort, PublicPort, IP, Type },
        ) => {
            if (IP !== '::1') {
                acc.push({
                    containerPort: PrivatePort,
                    hostPort: PublicPort,
                    hostIP: IP,
                    type: Type,
                });
            }
            return acc;
        },
        [],
    );
}
/**
 * Changes a port string to a ContainerPort type.
 */
const splitPort = (port: string) => {
    const [portNumber, type] = port.split('/');
    return { containerPort: parseInt(portNumber), type };
}
/**
 * Transform ports data from info to ContainerPort type.
 */
const formatInspectPorts = (data: ContainerInspectInfo): ContainerPort[] => {
    const portList: Set<ContainerPort> = new Set();
    const { NetworkSettings, Config } = data;
    // Check network settings for mapped ports
    Object.entries(NetworkSettings.Ports).forEach(([port, forwarded]) => {
        const formattedPort: ContainerPort = { ...splitPort(port) };
        if (forwarded) {
            formattedPort.hostPort = parseInt(forwarded[0].HostPort);
            formattedPort.hostIP = forwarded[0].HostIp;
        }
        portList.add(formattedPort);
    });
    // Check config for additional ports that might not be mapped
    Object.entries(Config.ExposedPorts).forEach(([port,]) => {
        const { containerPort, type } = splitPort(port);
        // Check to make sure the port doesn't already exist
        if (containerPort! in portList.values()) {
            portList.add({
                containerPort,
                type: type
            });
        }
    });
    return Array.from(portList);
}

export const normalizeContainers = async (
    data: ContainerInfo[],
): Promise<Container[]> => {
    const promises = data.map(normalizeContainerInfo, this);
    return Promise.all(promises);
}

export const normalizeContainerInfo = async (data: FixedContainerInfo): Promise<Container> => {
    return {
        name: data.Names[0].slice(1),
        id: data.Id,
        shortId: data['Id'].substring(0, 10),
        image: data['Image'],
        created: format(new Date(data.Created * 1000), 'MM/dd/yyyy'),
        status: data.State,
        state: data.Status,
        info: {
            title:
                data.Labels['sh.yacht.title'] ||
                data.Labels['org.opencontainers.image.title'],
            notes: data.Labels['sh.yacht.notes'],
            description: data.Labels['org.opencontainers.image.description'],
            external: data.Labels['sh.yacht.external'],
            subdomain: data.Labels['sh.yacht.subdomain'],
            docs: data.Labels['org.opencontainers.image.documentation'],
            url: data.Labels['org.opencontainers.image.url'],
            source: data.Labels['org.opencontainers.image.source'],
            vendor: data.Labels['org.opencontainers.image.vendor'],
            icon: await getIconUrl(data.Labels),
        },
        config: {
            network: {
                mode: data.HostConfig.NetworkMode,
                networks: data.NetworkSettings.Networks,
            },
        },
        mounts: data.Mounts ? formatMounts(data.Mounts) : null,
        ports: data.Ports ? formatInfoPorts(data.Ports) : null,
        labels: data.Labels,
    } as Container;
}

/**
 * Normalize container data from FixedContainerInspectInfo type.
 */
export const normalizeContainerInspectInfo = async (data: FixedContainerInspectInfo): Promise<Container> => {
    return {
        name: data.Name.slice(1),
        id: data.Id,
        shortId: data['Id'].substring(0, 10),
        image: data.Config.Image,
        created: format(parseISO(data['Created'].toString()), 'MM/dd/yyyy'),
        status: data.State.Status,
        restart: {
            policy: data.HostConfig.RestartPolicy?.Name,
            count: data.RestartCount,
        },
        info: {
            title:
                data.Config.Labels['sh.yacht.title'] ||
                data.Config.Labels['org.opencontainers.image.title'],
            notes: data.Config.Labels['sh.yacht.notes'],
            description: data.Config.Labels['org.opencontainers.image.description'],
            external: data.Config.Labels['sh.yacht.external'],
            subdomain: data.Config.Labels['sh.yacht.subdomain'],
            docs: data.Config.Labels['org.opencontainers.image.documentation'],
            url: data.Config.Labels['org.opencontainers.image.url'],
            source: data.Config.Labels['org.opencontainers.image.source'],
            vendor: data.Config.Labels['org.opencontainers.image.vendor'],
            icon: await getIconUrl(data.Config.Labels),
        },
        config: {
            network: {
                mode: data.HostConfig.NetworkMode,
                networks: data.NetworkSettings.Networks,
            },
            general: {
                hostname: data.Config.Hostname,
                tty: data.Config.Tty,
                user: data.Config.User,
                appArmorProfile: data.AppArmorProfile,
                driver: data.Driver,
                platform: data.Platform,
                path: data.Path,
                autoRemove: data.HostConfig.AutoRemove,
                logConfig: {
                    type: data.HostConfig.LogConfig?.Type,
                    config: data.HostConfig.LogConfig?.Config,
                },
                args: data.Args,
            },
        },
        mounts: data.Mounts ? formatMounts(data.Mounts) : null,
        ports: Object.keys(data.NetworkSettings.Ports).length
            ? formatInspectPorts(data)
            : null,
        labels: data.Config.Labels,
        env: data.Config.Env,
    } as Container;
}

/**
 * Normalize data from frontend and transform it into a valid ContainerCreateOptions object.
 */
export const normalizeCreate = async (
    data: CreateContainerForm,
): Promise<ContainerCreateOptions> => {
    const {
        name,
        image,
        restart,
        network,
        network_mode,
        mounts,
        ports,
        env,
        command,
        devices,
        sysctls,
        capabilities,
        limits,
    } = await transformVariables(data);
    const transformedLabels = await transformInfo(data);
    const containerCreateOptions: ContainerCreateOptions = {
        name,
        Image: image,
        HostConfig: {
            RestartPolicy: { Name: restart || 'never' },
            NetworkMode: network_mode || network,
            Binds: mounts?.map(
                ({ source, destination, read_only }) =>
                    `${source}:${destination}${read_only ? ':ro' : ''}`,
            ),
            Devices: devices?.map(({ host, container, permissions }) => ({ PathOnHost: host, PathInContainer: container, CgroupPermissions: permissions })),
            PortBindings: ports?.reduce((acc, { container, host, protocol }) => {
                acc[container + '/' + protocol] = [{ HostPort: host }];
                return acc;
            }, {} as { [index: string]: object }),
            Sysctls: sysctls?.reduce((acc, { name, value }) => {
                acc[name] = value;
                return acc;
            }, {} as { [index: string]: string }),
            CapAdd: capabilities?.add,
            CapDrop: capabilities?.drop,
            CpuShares: limits?.cpus,
            Memory: limits?.mem_limit,
        },
        Env: env ? env.map(({ name, value }) => `${name}=${value}`) : undefined,
        Labels: transformedLabels,
        Cmd: command,
    };
    return containerCreateOptions;
}

/**
 * Transform data from container create into labels in order to provide additional information about the container.
 */
const transformInfo = async (data: CreateContainerForm) => {
    const { labels, info, ports, env } = data;

    const [baseLabels, infoLabels, portLabels, envLabels] = await Promise.all([
        labels ? Object.fromEntries(labels.map(({ name, value }) => [name, value]),) : null,
        info ? Object.fromEntries(Object.entries(info).map(([key, value]) => [`sh.yacht.${key}`, value])) : null,
        ports ? Object.fromEntries(ports.map((port) => [`sh.yacht.${port.host}`, port.label])) : null,
        env ? Object.fromEntries(Object.entries(env).map(([name, env]) => [`sh.yacht.env.${name}.label`, env.label, `sh.yacht.env.${name}.description`, env.description])) : null
    ])

    const transformedLabels: { [label: string]: string } = {
        ...baseLabels,
        ...infoLabels,
        ...portLabels,
        ...envLabels
    }
    return transformedLabels;
}

const transformVariables = async (data: CreateContainerForm): Promise<CreateContainerForm> => {
    const config = await useConfig()
    if (!config.base['templateVariables']) {
        return data;
    }
    const variables = config.base['templateVariables'];
    const stringData = JSON.stringify(data)
    if (variables) {
        for (const variable of variables) {
            stringData.replaceAll(variable.variable, variable.replacement)
        }
        const replacedData: CreateContainerForm = JSON.parse(stringData)
        return replacedData
    }
    return data;
}

export interface FixedContainerStats extends DockerodeContainerStats {
    name?: string;
}

export function formatStats(stats: FixedContainerStats): string {
    const formattedStats: ContainerStat = {
        name: stats.name?.slice(1) ?? '',
        memoryPercentage: stats.memory_stats
            ? formatMemPercent(stats.memory_stats)
            : '0' ?? '0',
        cpuUsage: stats.cpu_stats ? formatCpuPercent(stats) : '0' ?? '0',
    };
    return JSON.stringify(formattedStats);
}

function formatCpuPercent(data: DockerodeContainerStats): string {
    const cpuDelta =
        data.cpu_stats.cpu_usage.total_usage -
        data.precpu_stats.cpu_usage.total_usage;
    const systemCpuDelta =
        data.precpu_stats.system_cpu_usage === undefined
            ? data.cpu_stats.system_cpu_usage
            : data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
    const cpuUsage =
        (cpuDelta / systemCpuDelta) * data.cpu_stats.online_cpus * 100.0;
    return cpuUsage.toFixed(2);
}

function formatMemPercent(data: DockerodeContainerStats['memory_stats']): string {
    const usedMemory =
        data.stats && data.stats.cache ? data.usage - data.stats.cache : data.usage;
    const memUsage = (usedMemory / data.limit) * 100.0;
    return memUsage.toFixed(2);
}