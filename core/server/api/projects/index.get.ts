import { z } from 'zod'

export default eventHandler(async (event) => {
    const { path, depth, relative, filter, hidden } = await getValidatedQuery(event,
        (e) => z.object({
            path: z.string().or(z.array(z.string())).optional(),
            relative: z.union([z.literal('true'), z.literal('false')]).optional(),
            depth: z.coerce.number().optional(),
            filter: z.string().optional(),
            hidden: z.union([z.literal('true'), z.literal('false')]).optional()
        }).parse(e)
    )
    const showHidden = hidden === 'true' ? true : false
    const isRelative = relative === 'true' ? true : false

    const response = await getTreeRoot({
        path: Array.isArray(path) ? path.join("") : path,
        relative: isRelative,
        options: {
            depth: depth,
            stat: true,
            homeShortcut: false,
            showHidden: showHidden,
            matches: filter
        },
        onDir: async (item) => {
            if (!item.children) item.children = []
        }
    })

    return response
})