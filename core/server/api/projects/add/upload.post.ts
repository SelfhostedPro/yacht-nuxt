import { z } from 'zod'

export default eventHandler(async (event) => {
    const { path } = await getValidatedQuery(event,
        (e) => z.object({ path: z.string().optional() }).parse(e)
    )
    return await getTreeRoot({ path })
})