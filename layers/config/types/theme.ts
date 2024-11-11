import { z } from 'zod'

const ThemeSettingsSchema = z.object({
    type: z.union([z.literal('light'), z.literal('dark'), z.literal('custom')]),
    primary: z.string().optional(),
    secondary: z.string().optional(),
    surface: z.string().optional(),
    foreground: z.string().optional(),
    background: z.string().optional(),
    error: z.string().optional(),
    info: z.string().optional(),
    warning: z.string().optional(),
    success: z.string().optional()
})

type ThemeSettings = z.infer<typeof ThemeSettingsSchema>

export { ThemeSettingsSchema, type ThemeSettings }