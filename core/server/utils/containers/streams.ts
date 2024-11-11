import { type FixedContainerStats, formatStats } from "./formatter"
import { PassThrough as StreamPassThrough } from "stream"
import type { ServerDict } from "#core/types/servers"
import { sseHooks } from "#core/server/utils/sse"
// Define a type for the send callback
type SendCallback = (callback: (id: number) => FixedContainerStats | string) => void

export const getContainerStats = async (close: () => void, send: SendCallback) => {
    const servers = Object.entries(await useServers())
    // Get all servers
    servers.map(
        async ([_server, docker]): Promise<void> => {
            // Get all containers on server
            const containers = await docker?.listContainers({ all: true }).catch((e) => {
                createError(e)
                return undefined
            })
            if (containers === undefined) {
                close()
                return
            } else {
                containers.map(
                    async (container) => {
                        if (container.State === 'running') {
                            // Get container object
                            const _container = docker?.getContainer(container.Id)
                            if (_container !== undefined) {
                                // Cache stats so we only send when they change
                                let cachedStats: FixedContainerStats | null = null;
                                // Placeholder string to assemble chunks of data
                                let partialChunk = '';

                                // Start streaming stats
                                _container.stats({ stream: true }, (err, stream) => {
                                    if (err) {
                                        console.error('Error getting container stats:', err)
                                        return
                                    }
                                    stream?.on('data', (data: Buffer) => {
                                        const chunkString = partialChunk + data.toString()
                                        const jsonChunks = chunkString.split('\n');
                                        partialChunk = jsonChunks.pop() || '';
                                        jsonChunks.forEach((jsonChunk) => {
                                            const containerStats: FixedContainerStats = JSON.parse(jsonChunk);
                                            if (
                                                !cachedStats ||
                                                containerStats.name !== cachedStats.name ||
                                                containerStats.cpu_stats.cpu_usage.total_usage !== cachedStats.cpu_stats.cpu_usage.total_usage ||
                                                containerStats.memory_stats.usage !== cachedStats.memory_stats.usage
                                            ) {
                                                cachedStats = containerStats;
                                                send(() => formatStats(containerStats))
                                                sseHooks.callHook("sse:containerStats", formatStats(containerStats));
                                            }
                                        });
                                    })
                                })
                            }
                        }
                    }
                )
            }
        },
    )
}

export const getContainerLogs = async (server: string, id: string, close: () => void, send: SendCallback) => {
    const _server = await useServers().then((servers: ServerDict) => servers[server])
    if (!_server) throw createError(new Error(`Server ${server} not found!`))
    const container = _server.getContainer(id)
    const running = await container.inspect().then((container) => container.State.Running)
    if (running) {
        const logStream = new StreamPassThrough()
        logStream.on('data', (chunk) => {
            send(() => chunk.toString('utf8'))
        });

        container.logs({
            follow: true,
            stdout: true,
            stderr: true,
            timestamps: false,
        }, (err, stream) => {
            if (err) {
                console.error('Error getting container logs:', err)
                close()
                return
            }
            container.modem.demuxStream(stream, logStream, logStream);
            stream?.on('end', function () {
                logStream.end('!stop!');
                close()
            });
        })
    }
}
