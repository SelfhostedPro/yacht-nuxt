import { z } from 'zod'

const RegisterUserFormSchema = z.object({
    username: z.string(),
    password: z.string(),
    confirm: z.string()
}).refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"], // path of error
});
type RegisterUserForm = z.infer<typeof RegisterUserFormSchema>
const LoginUserFormSchema = z.object({
    username: z.string(),
    password: z.string()
})
type LoginUserForm = z.infer<typeof LoginUserFormSchema>

export { RegisterUserFormSchema, LoginUserFormSchema, type RegisterUserForm, type LoginUserForm }