import { z } from 'zod'
const DBUserSchema = z.object({
    id: z.string(),
    role: z.union([z.literal('user'), z.literal('admin')]),
    username: z.string(),
})
const DBUserPrivateSchema = DBUserSchema.extend({
    hashedPassword: z.string()
})
type DBUser = z.infer<typeof DBUserSchema>
type DBUserPrivate = z.infer<typeof DBUserPrivateSchema>

export { DBUserSchema, DBUserPrivateSchema, type DBUser, type DBUserPrivate }