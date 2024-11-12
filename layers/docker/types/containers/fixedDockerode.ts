import { z } from 'zod'
import { containerInfoSchema, containerInspectInfoSchema } from './dockerode'
import type { VolumeInspectInfo } from 'dockerode'

// Types from dockerode are incorrect. These corrected schemas/types should be used.

const readableContainerInfoSchema = containerInfoSchema.extend({
    CreatedDate: z.union([z.string(), z.number()]).optional(),
    ShortId: z.string().optional(),
    ShortName: z.string().optional(),
    PortDetails: z.string().optional()
})

export type ReadableContainerInfo = z.infer<typeof readableContainerInfoSchema>

const fixedContainerInfoSchema = containerInfoSchema.extend({
    Mounts: z.array(
        z.object({
            Name: z.union([z.string(), z.undefined()]).optional(),
            Type: z.string(),
            Source: z.string(),
            Destination: z.string(),
            Driver: z.union([z.string(), z.undefined()]).optional(),
            Mode: z.string(),
            RW: z.boolean(),
            Propagation: z.string()
        })
    )
})

export type FixedContainerInfo = z.infer<typeof fixedContainerInfoSchema>


const fixedContainerInspectInfoSchema = containerInspectInfoSchema.extend({
    Mounts: z.array(
        z.object({
            Name: z.union([z.string(), z.undefined()]).optional(),
            Type: z
                .union([z.literal("volume"), z.literal("bind"), z.literal("tmpfs")]).optional(),
            Source: z.string(),
            Destination: z.string(),
            Driver: z.union([z.string(), z.undefined()]).optional(),
            Mode: z.string(),
            RW: z.boolean(),
            Propagation: z.string()
        })
    )
})

export type FixedContainerInspectInfo = z.infer<typeof fixedContainerInspectInfoSchema>

export interface FixedVolumeInspectInfo extends VolumeInspectInfo {
    CreatedAt?: string
  }
export { readableContainerInfoSchema, fixedContainerInfoSchema, fixedContainerInspectInfoSchema }