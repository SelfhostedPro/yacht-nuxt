import { z } from 'zod'

export default eventHandler(async (event) => {
    const { path } = await getValidatedQuery(event, query => z.object({ path: z.string().optional() }).parse(query))
    const { url } = await readValidatedBody(event, body => z.object({
        url: z.string().url()
    }).parse(body))

    return await cloneGitRepo(path || '', url)
})