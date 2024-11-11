import { z } from 'zod'
import { ServerSettingsSchema } from './server'
import { ThemeSettingsSchema } from './theme'
import { TemplateVariablesSchema } from './templates'
import { SecretsSchema } from './secrets'

export const YachtConfigSchema = z.object({
    name: z.string().optional(),
    servers: z.array(ServerSettingsSchema),
    templateVariables: z.array(TemplateVariablesSchema).optional(),
    theme: ThemeSettingsSchema,
    auth: z.boolean(),
    plugins: z.array(z.string()),
    sessionTimeout: z.number().optional(),
    secrets: z.optional(SecretsSchema),
    extends: z.string().optional(),
})

export type YachtConfig = z.infer<typeof YachtConfigSchema>