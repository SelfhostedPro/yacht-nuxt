import { z } from 'zod'

export default eventHandler(async (event) => {
    const { content, path } = await readValidatedBody(event,
        (e) => z.object({
            path: z.string(),
            content: z.string()
        }).parse(e)
    )
    return saveFile(path, content)
})