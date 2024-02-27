import { z } from 'zod'

const userSchema = z.object({
    id: z.number(),
    username: z.string(),
    roles: z.array(z.string()).default(['user']),
    password: z.string(),
    hashedPassword: z.string(),
    salt: z.string(),
    otpSecret: z.string(),
    otpActive: z.boolean(),
    refreshToken: z.string(),
    newPassword: z.string()
}).partial()
export type User = z.infer<typeof userSchema>

const authFileUserSchema = userSchema.required({ id: true, username: true, hashedPassword: true, roles: true })
export type AuthfileUser = z.infer<typeof authFileUserSchema>

const desentitizedAuthfileUserSchema = userSchema.required({ id: true, username: true, roles: true, otpActive: true })
export type DesentizedAuthfileUser = z.infer<typeof desentitizedAuthfileUserSchema>

const userCreateSchema = userSchema.required({ username: true, password: true, roles: true })
export type UserCreate = z.infer<typeof userCreateSchema>

const userLoginSchema = userSchema.required({ username: true, password: true })
export type UserLogin = z.infer<typeof userLoginSchema>