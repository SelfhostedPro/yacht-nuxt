import { z } from 'zod'

const TemplateVariablesSchema = z.object({
    variable: z.string(),
    replacement: z.string()
})

type TemplateVariables = z.infer<typeof TemplateVariablesSchema>

export { TemplateVariablesSchema, type TemplateVariables }