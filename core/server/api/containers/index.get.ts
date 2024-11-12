import { getContainers } from '#docker/server/utils/containers/info'
export default defineEventHandler(async () => {
    return await getContainers()
})