import { z } from 'zod'
export const DBUserSchema = z.object({
    id: z.string(),
    role: z.union([z.literal('user'), z.literal('admin')]),
    username: z.string(),
    hashedPassword: z.string()
})
export type DBUser = z.infer<typeof DBUserSchema>
export const RefisterUserFormSchema = z.object({
    username: z.string(),
    password: z.string(),
    confirm: z.string()
}).refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
});
export type RegisterUserForm = z.infer<typeof RefisterUserFormSchema>
export const LoginUserFormSchema = z.object({
    username: z.string(),
    password: z.string()
})
export type LoginUserForm = z.infer<typeof LoginUserFormSchema>
