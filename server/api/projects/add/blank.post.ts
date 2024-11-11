import { z } from 'zod'

export default eventHandler(async (event) => {
    const { path } = await getValidatedQuery(event, query => z.object({ path: z.string().optional() }).parse(query))
    const { name } = await readValidatedBody(event, body => z.object({
        name: z.string()
    }).parse(body))
    if (path?.endsWith('/')) {
        return await newFolder(path || '', name)
    } else {
        return await newFile(path || '', name)
    }
})