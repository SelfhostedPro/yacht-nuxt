import { z } from 'zod'
import { Buffer } from 'buffer'

const KeyObjectSchema = z.object({
    pem: z.union([z.string(), z.instanceof(Buffer)]),
    passphrase: z.string().optional()
})

export const newServerOptionsSchema = z.object({
    socketPath: z.string().optional(),
    host: z.string().optional(),
    port: z.union([z.number(), z.string()]).optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    headers: z.record(z.string()).optional(),
    ca: z.union([z.string(), z.array(z.string()), z.instanceof(Buffer), z.array(z.instanceof(Buffer))]).optional(),
    cert: z.union([z.string(), z.array(z.string()), z.instanceof(Buffer), z.array(z.instanceof(Buffer))]).optional(),
    key: z.union([z.string(), z.array(z.string()), z.instanceof(Buffer), z.array(z.instanceof(Buffer)), z.array(KeyObjectSchema)]).optional(),
    protocol: z.enum(['https', 'http', 'ssh', 'local']).optional(),
    timeout: z.number().optional(),
    version: z.string().optional(),
    sshAuthAgent: z.string().optional(),
    Promise: z.instanceof(Promise).optional()
})

export const newServerSchema = z.object({
    name: z.string(),
    options: newServerOptionsSchema,
    keyname: z.string().optional(),
    copyToServer: z.boolean().optional()
})

export type NewServer = z.infer<typeof newServerSchema>
export type NewServerOptions = z.infer<typeof newServerOptionsSchema>