import { z } from 'zod'

const ServerSSHKeySchema = z.object({
    pem: z.union([z.string(), z.instanceof(Buffer)]).optional(),
    passphrase: z.string().optional()
})

const ServerConnectionSchema = z.object({
    socketPath: z.string().optional(),
    host: z.string().optional(),
    port: z.union([z.string(), z.number()]).optional(),
    username: z.string().optional(),
    headers: z.record(z.string()).optional(),
    ca: z.union([z.string(), z.array(z.string()), z.instanceof(Buffer), z.array(z.instanceof(Buffer))]).optional(),
    cert: z.union([z.string(), z.array(z.string()), z.instanceof(Buffer), z.array(z.instanceof(Buffer))]).optional(),
    key: z.union([z.string(), z.array(z.string()), z.instanceof(Buffer), z.array(z.instanceof(Buffer)), z.array(ServerSSHKeySchema)]).optional(),
    protocol: z.union([z.literal('https'), z.literal('http'), z.literal('ssh')]).optional(),
    timeout: z.number().optional(),
    version: z.string().optional(),
    sshAuthAgent: z.string().optional(),
    Promise: z.instanceof(Promise).optional()
})

type ServerConnection = z.infer<typeof ServerConnectionSchema>

const ServerSettingsSchema = z.object({
    name: z.string(),
    options: ServerConnectionSchema.optional(),
    key: z.string().optional()
})

type ServerSettings = z.infer<typeof ServerSettingsSchema>

export { ServerSettingsSchema, ServerConnectionSchema, type ServerSettings, type ServerConnection }