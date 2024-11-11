import { z } from 'zod'

const SecretsSchema = z.object({
    authSecret: z.string(),
    accessSecret: z.string(),
    refreshSecret: z.string(),
    passphraseSecret: z.object({
        key: z.string(),
        iv: z.string()
    })
})

type ConfigSecrets = z.infer<typeof SecretsSchema>

export { SecretsSchema, type ConfigSecrets }