import { getContainers } from '~/server/services/containers/info'

export default defineEventHandler(async () => {
    return await getContainers()
})