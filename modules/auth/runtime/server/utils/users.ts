import { Argon2id } from "oslo/password";
// import { userTable } from '~/server/utils/db/schema'
import { generateId } from "lucia";
// import type { DBUser } from "~~/types/auth";
import { SqliteError } from "better-sqlite3";
import type { DBUser } from "~~/modules/db/types/user";
import { useDB } from '~~/modules/db/runtime/server/utils/db'
import { createError } from '#imports'

export const getUsers = async () => {
    const db = useDB()
    try {
        return (await db.selectFrom('user').select(["id", "role", "username"]).execute()) as DBUser[]
    } catch (e) {
        throw createError({
            message: "An unknown error occurred",
            data: e,
            statusCode: 500
        });
    }
}

export const createUser = async (username: string, password: string, role?: 'user' | 'admin') => {
    const db = useDB()
    const hashedPassword = await new Argon2id().hash(password);
    const userId = generateId(15);
    try {
        await db.insertInto('user')
            .values({
                id: userId,
                username: username,
                role: role || 'user',
                hashedPassword: hashedPassword
            }).executeTakeFirst()
        const createdUser = await db.selectFrom('user').select(['id', 'username', 'role']).where('id', '==', userId).executeTakeFirstOrThrow()
        Logger(`Created new user ${createdUser.id} ${createdUser.username}`)
        return createdUser
    } catch (e) {
        if (e instanceof SqliteError && e.code === "SQLITE_CONSTRAINT_UNIQUE") {
            throw createError({
                message: "Username already used",
                statusCode: 500
            });
        }
        throw createError({
            message: "An unknown error occurred",
            statusCode: 500
        });
    }
}