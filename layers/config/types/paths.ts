import { z } from 'zod'

const ConfigPathsSchema = z.object({
    config: z.string(),
    secrets: z.string(),
    ssh: z.string(),
    auth: z.string(),
    templates: z.string(),
    backups: z.object({
        config: z.string(),
        instance: z.string()
    }),
})

type ConfigPaths = z.infer<typeof ConfigPathsSchema>

export { ConfigPathsSchema, type ConfigPaths }