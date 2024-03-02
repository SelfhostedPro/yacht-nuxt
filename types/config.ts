import { z } from "zod";
export const KeyObjectSchema = z.object({
  pem: z.union([z.string(), z.instanceof(Buffer)]).optional(),
  passphrase: z.string().optional()
})

export type KeyObject = z.infer<typeof KeyObjectSchema>

export const ThemeSettingsSchema = z.object({
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

export type ThemeSettings = z.infer<typeof ThemeSettingsSchema>

export const DockerOptionsSchema = z.object({
  socketPath: z.string().optional(),
  host: z.string().optional(),
  port: z.union([z.string(), z.number()]).optional(),
  username: z.string().optional(),
  headers: z.record(z.string()).optional(),
  ca: z.union([z.string(), z.array(z.string()), z.instanceof(Buffer), z.array(z.instanceof(Buffer))]).optional(),
  cert: z.union([z.string(), z.array(z.string()), z.instanceof(Buffer), z.array(z.instanceof(Buffer))]).optional(),
  key: z.union([z.string(), z.array(z.string()), z.instanceof(Buffer), z.array(z.instanceof(Buffer)), z.array(KeyObjectSchema)]).optional(),
  protocol: z.union([z.literal('https'), z.literal('http'), z.literal('ssh')]).optional(),
  timeout: z.number().optional(),
  version: z.string().optional(),
  sshAuthAgent: z.string().optional(),
  Promise: z.instanceof(Promise).optional()
})

export type DockerOptions = z.infer<typeof DockerOptionsSchema>

export const ServerConfigSchema = z.object({
  name: z.string(),
  options: DockerOptionsSchema.optional(),
  key: z.string().optional()
})

export type ServerConfig = z.infer<typeof ServerConfigSchema>

export const TemplateVariablesSchema = z.object({
  variable: z.string(),
  replacement: z.string()
})
export type TemplateVariables = z.infer<typeof TemplateVariablesSchema>

export const YachtSecretSchema = z.object({
  authSecret: z.string(),
  accessSecret: z.string(),
  refreshSecret: z.string(),
  passphraseSecret: z.object({
    key: z.string(),
    iv: z.string()
  })
})

export type YachtSecrets = z.infer<typeof YachtSecretSchema>

export const YachtPathSchema = z.object({
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
export type YachtPaths = z.infer<typeof YachtPathSchema>


export const YachtConfigSchema = z.object({
  name: z.string(),
  auth: z.boolean(),
  servers: z.array(ServerConfigSchema),
  theme: ThemeSettingsSchema,
  plugins: z.array(z.string()),
  sessionTimeout: z.number(),
  templates: z.array(z.object({
    url: z.string(),
    name: z.string(),
    apps: z.array(z.any())
  })).optional(),
  templateVariables: z.array(TemplateVariablesSchema).optional(),
  extends: z.string().optional()
})
export type YachtConfig = z.infer<typeof YachtConfigSchema>

// Interfaces
export const YachtConfigFullSchema = YachtConfigSchema.extend({
  secrets: YachtSecretSchema.optional(),
  paths: YachtPathSchema
})
export type YachtConfigFull = z.infer<typeof YachtConfigFullSchema>

export const configPaths: YachtPaths = {
  config: process.env.CONFIG_FILE || 'config.yml',
  secrets: process.env.SECRETS_FILE || '.secrets.json',
  ssh: process.env.SSH_PATH || '.ssh/',
  auth: process.env.AUTH_PATH || '.auth/',
  backups: {
    config: process.env.BACKUP_CONFIG_PATH || 'backups/config',
    instance: process.env.BACKUP_INSTANCE_PATH || 'backups/instance'
  },
  templates: process.env.TEMPLATE_PATH || 'templates/'
}

export const DefaultConfig: YachtConfigFull = {
  name: 'Yacht',
  servers: [
    {
      name: 'local',
      options: {
        socketPath: process.env.DOCKER_HOST ?? '/var/run/docker.sock',
      },
    },
  ],
  auth: true,
  theme: {
    type: 'dark',
  },
  plugins: [],
  sessionTimeout: 3600,
  paths: configPaths,
  extends: configPaths.secrets
}