import { Argon2id } from "oslo/password";
// import { db } from "~/server/utils/db";
import { generateId } from "lucia";
import { LoginUserFormSchema } from "../../../../types/auth";
import { useLucia } from '../../utils/auth'
import type { DBUserPrivate } from "~~/modules/db/types/user";
import type { LoginUserForm } from "../../../../types/auth";

export default eventHandler(async (event) => {
    const db = useDB()
    const lucia = useLucia()
    const { username, password }: LoginUserForm = await readValidatedBody(event, body => LoginUserFormSchema.parse(body))
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
    const existingUser = await db.selectFrom('user').selectAll().where('username', '==', username).executeTakeFirst() as
        | DBUserPrivate
        | undefined;
    if (!existingUser) {
        await new Argon2id().verify(generateId(password.length), password);
        throw createError({
            message: "Incorrect username or password",
            statusCode: 400
        });
    }

    const validPassword = await new Argon2id().verify(existingUser.hashedPassword, password);
    if (!validPassword) {
        throw createError({
            message: "Incorrect username or password",
            statusCode: 400
        });
    }

    const session = await lucia.createSession(existingUser.id, {});
    appendHeader(event, "Set-Cookie", lucia.createSessionCookie(session.id).serialize());
    // authHooks.callHook('login', session.id)
    return { status: 'success', message: 'logged in' }
});