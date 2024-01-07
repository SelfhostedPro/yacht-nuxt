import Docker from 'dockerode'
import getServers from '~/server/utils/servers'
import type { Container } from '~/types/containers/yachtContainers'
import { normalizeContainers } from '~/server/utils/formatter'
import type { ServerContainers } from '~/types/servers'
import YachtError from '~/server/utils/errors'

export default defineEventHandler(async () => {
    const serversReturn = {} as ServerContainers
    const servers = Object.entries(await getServers())

    // Get containers from all servers in config
    const serverPromises = servers.map(
        async ([server, docker]) => {
            const containers = await docker?.listContainers({ all: true })
            if (containers !== undefined) serversReturn[server] = await normalizeContainers(containers)
            else serversReturn[server] = [] as Container[]
        },
    )
    // Wait for containers to resolve
    await Promise.all(serverPromises)
    return serversReturn
})