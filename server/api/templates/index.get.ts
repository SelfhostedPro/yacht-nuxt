import { getTemplates } from '~/server/services/templates/info'

export default defineEventHandler(async () => {
    return await getTemplates()
})