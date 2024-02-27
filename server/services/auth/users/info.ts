import type { AuthfileUser, DesentizedAuthfileUser, User } from "~/types/users";
import * as path from 'path';
import { checkAuthFile } from "./actions";

const config = await useConfig()
const authStorage = useStorage(config.static.paths.auth)


/**
 * Returns all the users
 * @param strip if true, remove the users salt and hashed password from the response
 */
export const get = async (strip?: boolean): Promise<AuthfileUser[] | DesentizedAuthfileUser[]> => {
    await checkAuthFile()
    const users = await authStorage.getItem<AuthfileUser[]>('auth.json')
    if (!users) return [] as AuthfileUser[]
    if (strip) {
        return users.map(desensitiseUserProfile) as DesentizedAuthfileUser[];
    }
    return users as AuthfileUser[];
}

/**
 * Return a user by it's id
 * @param id
 */
export const findById = async (id: number): Promise<AuthfileUser> => {
    const users = await get() as AuthfileUser[];
    const user = users.find((x) => x.id === id);
    if (!user) throw createError('User not found!')
    return user;
}
/**
 * Return a user by it's username
 * @param username
 */
export const findByUsername = async (username: string): Promise<AuthfileUser> => {
    const users = await get() as AuthfileUser[];
    const user = users.find((x) => x.username === username);
    if (!user) throw createError('User not found!')
    return user;
}

/**
 * Clean the user profile of sensitive data
 */
export const desensitiseUserProfile = (user: AuthfileUser): DesentizedAuthfileUser => {
    return {
        id: user.id,
        username: user.username,
        roles: user.roles,
        otpActive: user.otpActive || false,
    };
}