import type { DockerVersion } from "dockerode"
import type { DockerUsageInfo, DockerSystemInfo, ServerStats } from "~~/types/servers"
interface ServerInfoDict {
    [key: string]: ServerInfo
}

interface ServerInfo {
    info: DockerSystemInfo
    versions: DockerVersion
    usage: DockerUsageInfo
}

export const getServerInfo = async () => {
    const serversReturn = {} as ServerInfoDict
    const servers = Object.entries(await useServers())
    await Promise.all(servers.map(async ([_server, docker]) => {
        const info = await docker?.info()
        const versions = await docker?.version()
        const usage = await docker?.df()
        serversReturn[_server] = {
            info,
            versions,
            usage
        }
    }))
    return serversReturn
}

export const getServerStats = async (close: () => void, send: (callback: (id: number) => any) => void) => {
    try {
        const servers = Object.entries(await useServers())
        const serverInfo = await getServerInfo()

        const serverStats: { [key: string]: ServerStats } = {}

        let lastSentStats: string | null = null
        let throttleTimer: NodeJS.Timeout | null = null

        const sendThrottledUpdate = debounce(() => {
            const currentStats = JSON.stringify(serverStats)
            if (currentStats !== lastSentStats) {
                send(() => currentStats)
                sseHooks.callHook("sse:serverStats", currentStats)
                lastSentStats = currentStats
            }
        }, 1000)

        await Promise.all(servers.map(async ([serverName, docker]) => {
            if (!docker) return

            const containers = await docker.listContainers({ all: true })
            if (!containers?.length) {
                console.warn(`No containers found for ${serverName}`)
                return
            }

            const info = serverInfo[serverName]?.info
            if (!info) {
                console.error(`No server info found for ${serverName}`)
                return
            }

            serverStats[serverName] = {
                cpuTotal: info.NCPU,
                memoryTotal: info.MemTotal,
                containers: {}
            }

            const runningContainers = containers.filter(container => container.State === 'running')
            
            await Promise.all(runningContainers.map(async (container) => {
                const _container = docker.getContainer(container.Id)
                if (!_container) {
                    console.warn(`Container ${container.Id} not found for ${serverName}`)
                    return
                }

                let cachedStats: FixedContainerStats | null = null
                let partialChunk = ''

                const stream = await _container.stats({ stream: true })
                stream.on('error', (e) => Logger.error(e, `${_container.id} - logs`))
                stream.on('data', (data: Buffer) => {
                    const chunkString = partialChunk + data.toString()
                    const jsonChunks = chunkString.split('\n')
                    partialChunk = jsonChunks.pop() || ''

                    jsonChunks.forEach((jsonChunk) => {
                        try {
                            const containerStats: FixedContainerStats = JSON.parse(jsonChunk)
                            if (
                                !cachedStats ||
                                containerStats.name !== cachedStats.name ||
                                containerStats.cpu_stats.cpu_usage.total_usage !== cachedStats.cpu_stats.cpu_usage.total_usage ||
                                containerStats.memory_stats.usage !== cachedStats.memory_stats.usage
                            ) {
                                cachedStats = containerStats
                                const formattedStats = formatStats(containerStats)
                                if (serverStats[serverName] && containerStats.name) {
                                    serverStats[serverName].containers[containerStats.name] = JSON.parse(formattedStats)
                                    sendThrottledUpdate()
                                }
                            }
                        } catch (error) {
                            console.error(`Error processing JSON chunk for ${_container.id}:`, error)
                        }
                    })
                })
            }))
        }))
    } catch (error) {
        console.error("Error in getServerStats:", error)
        close()
        throw createError(error as Error)
    }
}

// Debounce function
function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout | null = null
    return function executedFunction(...args: any[]) {
        const later = () => {
            timeout = null
            func(...args)
        }
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}
