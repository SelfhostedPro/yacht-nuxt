import type { ContainerStats as DockerodeContainerStats } from 'dockerode';
import type { ContainerStat } from '~/types/containers/yachtContainers';
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