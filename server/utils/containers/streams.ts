import { type FixedContainerStats, formatStats } from "./formatter"
import { PassThrough as StreamPassThrough } from "stream"

// Service Dependency Imports
import type { ServerDict } from "~~/types/servers"

export const getContainerStats = async (close: () => void, send: (callback: (id: number) => any) => void) => {
    try {
        const servers = Object.entries(await useServers())

        await Promise.all(servers.map(async ([_server, docker]) => {
            const containers = await docker?.listContainers({ all: true })
            if (!containers) return

            await Promise.all(containers.filter(container => container.State === 'running').map(async (container) => {
                const _container = docker?.getContainer(container.Id)
                if (!_container) return

                let cachedStats: FixedContainerStats | null = null
                let partialChunk = ''

                const stream = await _container.stats({ stream: true })
                stream.on('error', (e) => Logger.error(e, `${_container.id} - logs`))
                stream.on('data', (data: Buffer) => {
                    const chunkString = partialChunk + data.toString()
                    const jsonChunks = chunkString.split('\n')
                    partialChunk = jsonChunks.pop() || ''

                    jsonChunks.forEach((jsonChunk) => {
                        const containerStats: FixedContainerStats = JSON.parse(jsonChunk)
                        if (
                            !cachedStats ||
                            containerStats.name !== cachedStats.name ||
                            containerStats.cpu_stats.cpu_usage.total_usage !== cachedStats.cpu_stats.cpu_usage.total_usage ||
                            containerStats.memory_stats.usage !== cachedStats.memory_stats.usage
                        ) {
                            cachedStats = containerStats
                            const formattedStats = formatStats(containerStats)
                            send(() => formattedStats)
                            sseHooks.callHook("sse:containerStats", formattedStats)
                        }
                    })
                })
            }))
        }))
    } catch (error) {
        close()
        throw createError(error as Error)
    }
}
export const getContainerLogs = async (server: string, id: string, close: () => void, send: (callback: (id: number) => any) => void) => {
    try {
        const _server = await useServers().then((servers: ServerDict) => servers[server])
        if (!_server) throw createError(new Error(`Server ${server} not found!`))

        const container = _server.getContainer(id)
        const { State: { Running } } = await container.inspect()

        if (Running) {
            const logStream = new StreamPassThrough()
            logStream.on('data', (chunk) => {
                send(() => chunk.toString('utf8'))
            })

            const stream = await container.logs({
                follow: true,
                stdout: true,
                stderr: true,
                timestamps: false,
            })

            container.modem.demuxStream(stream, logStream, logStream)
            stream.on('error', (e) => Logger.error(e, `${container.id} - logs`))
            stream.on('end', () => {
                logStream.end('!stop!')
                close()
            })
        }
    } catch (error) {
        close()
        throw createError(error as Error)
    }
}