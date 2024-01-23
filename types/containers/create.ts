import { z } from "zod"
import { containerOciInfoSchema } from "./yachtContainers"

export const keyValueSchema = z.object({
  key: z.string(),
  value: z.string()
})

export const containerFormEnvsSchema = z.object({
  name: z.string().optional(),
  value: z.string().optional(),
  description: z.string().optional(),
  label: z.string().optional()
})

export const containerFormUnchangableSchema = z.object({
  property: z.union([
    z.literal("host"),
    z.literal("container"),
    z.literal("protocol")
  ])
})

export const containerFormPortsSchema = z.object({
  label: z.string().optional(),
  host: z.string().optional(),
  container: z.string().optional(),
  protocol: z.union([z.literal("tcp"), z.literal("udp")]).optional(),
  description: z.string().optional(),
  unchangable: z
    .union([z.boolean(), z.array(containerFormUnchangableSchema)])
    .optional()
})

export const containerFormVolumesSchema = z.object({
  label: z.string().optional(),
  source: z.string().optional(),
  destination: z.string().optional(),
  read_only: z.boolean().optional()
})

export const networkModesSchema = z.object({
  network_modes: z.union([
    z.literal("bridge"),
    z.literal("host"),
    z.literal("none")
  ])
})

export const capDropSchema = z.object({
  option: z.union([
    z.literal("AUDIT_WRITE"),
    z.literal("CHOWN"),
    z.literal("DAC_OVERRIDE"),
    z.literal("FOWNER"),
    z.literal("FSETID"),
    z.literal("KILL"),
    z.literal("SETGID"),
    z.literal("SETUID"),
    z.literal("SETPCAP"),
    z.literal("NET_BIND_SERVICE"),
    z.literal("NET_RAW"),
    z.literal("SYS_CHROOT")
  ])
})

export const capAddSchema = z.object({
  option: z.union([
    z.literal("SYS_MODULE"),
    z.literal("SYS_RAWIO"),
    z.literal("SYS_PACCT"),
    z.literal("SYS_ADMIN"),
    z.literal("SYS_NICE"),
    z.literal("SYS_RESOURCE"),
    z.literal("SYS_TIME"),
    z.literal("SYS_TTY_CONFIG"),
    z.literal("AUDIT_CONTROL"),
    z.literal("MAC_ADMIN"),
    z.literal("MAC_OVERRIDE"),
    z.literal("NET_ADMIN"),
    z.literal("SYSLOG"),
    z.literal("DAC_READ_SEARCH"),
    z.literal("LINUX_IMMUTABLE"),
    z.literal("NET_BROADCAST"),
    z.literal("IPC_LOCK"),
    z.literal("IPC_OWNER"),
    z.literal("SYS_PTRACE"),
    z.literal("SYS_BOOT"),
    z.literal("LEASE"),
    z.literal("WAKE_ALARM"),
    z.literal("BLOCK_SUSPEND")
  ])
})


export const createContainerFormSchema = z.object({
  name: z.string().optional(),
  image: z.string(),
  info: containerOciInfoSchema.optional(),
  restart: z.string().optional(),
  server: z.string(),
  network: z.string().optional(),
  network_mode: z.string().optional(),
  mounts: z.array(containerFormVolumesSchema).optional(),
  ports: z.array(containerFormPortsSchema).optional(),
  env: z.array(containerFormEnvsSchema).optional(),
  labels: z.array(keyValueSchema).optional(),
  command: z.array(z.string()).optional(),
  devices: z.array(z.string()).optional(),
  sysctls: z.array(keyValueSchema).optional(),
  capabilities: z
    .object({
      add: z.array(capAddSchema).optional(),
      drop: z.array(capDropSchema).optional()
    })
    .optional(),
  limits: z
    .object({
      cpus: z.number().optional(),
      mem_limit: z.number().optional()
    })
    .optional()
})
