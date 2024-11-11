import { z } from 'zod'
export default defineEventHandler(async (event) => {
    const { path, action } = await readValidatedBody(event, (e) => z.object({
        path: z.string(),
        action: z.union([z.literal('up'), z.literal('down')])
    }).parse(e))
    return await projectAction(path, action)
})
