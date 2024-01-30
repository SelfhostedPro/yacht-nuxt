import { z } from "zod"
import { capAddSchema, capDropSchema, keyValueSchema } from "../shared"

export const yachtTemplateLinkSchema = z.object({
  url: z.string(),
  text: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional()
})

export const yachtTemplateAuthorSchema = z.object({
  name: z.string(),
  url: z.string().optional(),
  avatar: z.string().optional()
})

export const yachtV2TemplatePortValueSchema = z.object({
  host: z.string().optional(),
  container: z.string().optional(),
  protocol: z.union([z.literal("tcp"), z.literal("udp")]).optional(),
  description: z.string().optional(),
  unchangable: z
    .union([
      z.boolean(),
      z.array(
        z.union([
          z.literal("host"),
          z.literal("container"),
          z.literal("protocol")
        ])
      )
    ])
    .optional()
})

export const yachtV2TemplatePortSchema = z.record(
  yachtV2TemplatePortValueSchema
)

export const yachtV1TemplatePortSchema = z.record(z.string())
export const yachtTemplateVolumeSchema = z.object({
  container: z.string(),
  bind: z.string().optional(),
  readonly: z.boolean().optional(),
  label: z.string().optional()
})

export const yachtTemplateLabelsSchema = z.object({
  name: z.string(),
  value: z.string()
})

export const yachtTemplateEnvironmentSchema = z.object({
  name: z.string(),
  label: z.string().optional(),
  description: z.string().optional(),
  default: z.string().optional(),
  preset: z.boolean().optional(),
  set: z.string().optional(),
  value: z.string().optional()
})

export const portainerTemplateStackSchema = z.object({
  url: z.string(),
  stackfile: z.string()
})

export const portainerTemplateAccessControlSchema = z.object({
  enabled: z.boolean()
})


export const yachtV1TemplateSchema = z.object({
  type: z.number().optional(),
  title: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  note: z.string().optional(),
  image: z.string(),
  registry: z.string().optional(),
  administrator_only: z.boolean().optional(),
  access_control: portainerTemplateAccessControlSchema.optional(),
  command: z.string().optional(),
  network: z.string().optional(),
  repository: portainerTemplateStackSchema.optional(),
  categories: z.array(z.string()).optional(),
  platform: z.union([z.literal("linux"), z.literal("windows")]).optional(),
  restart_policy: z.string().optional(),
  ports: z
    .union([
      yachtV1TemplatePortSchema,
      z.array(z.string())
    ])
    .optional(),
  volumes: z.array(yachtTemplateVolumeSchema).optional(),
  env: z.array(yachtTemplateEnvironmentSchema).optional(),
  labels: z.array(keyValueSchema).optional(),
  privileged: z.boolean().optional(),
  interactive: z.boolean().optional(),
  hostname: z.string().optional(),
  cap_add: z.array(capAddSchema).optional(),
  cap_drop: z.array(capDropSchema).optional(),
  sysctls: z.array(keyValueSchema).optional(),
  devices: z.array(z.string()).optional(),
  limits: z
    .object({
      cpus: z.number().optional(),
      mem_limit: z.number().optional()
    })
    .optional()
})

export const yachtV2TemplateSchema = yachtV1TemplateSchema.extend({
  featured_image: z.string().optional(),
  ports: z
    .union([
      yachtV1TemplatePortSchema,
      yachtV2TemplatePortSchema,
      z.array(z.string())
    ])
    .optional(),
})

export const portainerV1TemplateSchema = yachtV1TemplateSchema.extend({
  type: z.number(),
  ports: z.array(z.string()).optional()
})



export const portainerV2TemplateSchema = z.object({
  version: z.literal("2"),
  templates: z.array(portainerV1TemplateSchema)
})

export const yachtTemplateSchema = z.object({
  name: z.string(),
  url: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  image: z.string().optional(),
  created: z.string().optional(),
  updated: z.string().optional(),
  type: z
    .union([
      z.literal("portainerv1"),
      z.literal("portainerv2"),
      z.literal("yachtv1"),
      z.literal("yachtv2")
    ])
    .optional(),
  authors: z.array(yachtTemplateAuthorSchema).optional(),
  links: z.array(yachtTemplateLinkSchema).optional(),
  featured: z.array(z.number()).optional(),
  templates: z.union([
    z.array(portainerV1TemplateSchema),
    portainerV2TemplateSchema.shape.templates,
    z.array(yachtV1TemplateSchema),
    z.array(yachtV2TemplateSchema)
  ])
})

export type YachtTemplate = z.infer<typeof yachtTemplateSchema>