import { z } from 'zod'

export default eventHandler(async (event) => {
    const { path } = await getValidatedQuery(event,
        (e) => z.object({ path: z.string() }).parse(e)
    )
    await readValidatedBody(event,
        (e) => z.object({ content: z.string() }).parse(e)
    )
    return await getFile(path)
})