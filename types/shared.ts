import { z } from "zod"

export const keyValueSchema = z.object({
    key: z.string(),
    value: z.string()
})
export const nameValueSchema = z.object({
    name: z.string(),
    value: z.string()
})
export const optionalNameValueSchema = z.object({
    name: z.string().optional(),
    value: z.string().optional()
})
export const capDropSchema = z.union([
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

export const capAddSchema = z.union([
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
