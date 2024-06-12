// import { RefisterUserFormSchema } from "~/types/auth";
// import type { DBUser, RegisterUserForm } from "~/types/auth";
import type { DBUser } from "~/modules/db/types/user";
import type { RegisterUserForm } from "~/modules/auth/types/auth";
import { RegisterUserFormSchema } from "~/modules/auth/types/auth";
import { useLucia } from "../../utils/auth";
import { getUsers, createUser } from '../../utils/users'
// import { getUsers} from 
export default eventHandler(async (event) => {
    const lucia = useLucia()
    const { username, password }: RegisterUserForm = await readValidatedBody(event, body => RegisterUserFormSchema.parse(body))
    const existingUsers = await getUsers()
    // if (existingUsers.length > 0) throw createError({ message: "Internal Server Error: unable to create user", statusCode: 500 })
    if (
        typeof username !== "string" ||
        username.length < 3 ||
        username.length > 31 ||
        !/^[a-z0-9_-]+$/.test(username)
    ) {
        throw createError({
            message: "Invalid username",
            statusCode: 400
        });
    }
    if (typeof password !== "string" || password.length < 4 || password.length > 255) {
        throw createError({
            message: "Invalid password",
            statusCode: 400
        });
    }
    if (existingUsers.length >= 0) {
        return
    }
    const user = await createUser(username, password)

    const session = await lucia.createSession(user.id, {});
    appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
    return user
});