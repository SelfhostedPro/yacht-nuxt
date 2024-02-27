import type { AuthfileUser, User, UserCreate } from '~/types/users'
import * as path from 'path';
import * as argon2 from 'argon2';

import { get, desensitiseUserProfile } from './info'

const config = await useConfig()
const authStorage = useStorage(config.static.paths.auth)

export const checkAuthFile = async () => {
    const exists = authStorage.getItem<User[]>('auth.json')
    if (!exists) saveAuthFile([])
    useRuntimeConfig().yacht.setupWizard = true;
}

/**
 * Add a new user
 * @param user
 */
export const create = async (user: UserCreate) => {
    const authfile = await get() as AuthfileUser[];
    if (authfile.find((x) => x.username === user.username.toLocaleLowerCase())) throw createError(`User with username '${user.username}' already exists.`)

    // user object
    const newUser: AuthfileUser = {
        id: authfile.length ? authfile.length + 1 : 1,
        username: user.username,
        roles: user.roles,
        hashedPassword: await hashData(user.password)
    };

    // add the user to the authfile
    authfile.push(newUser);

    // update the auth.json
    await saveAuthFile(authfile);
    return desensitiseUserProfile(newUser);
}

const saveAuthFile = async (users: AuthfileUser[]) => {
    authStorage.setItem<User[]>('auth.json', users)
}

const hashData = async (data: string) => {
    return await argon2.hash(data, { secret: Buffer.from(config.secrets.authSecret) });
}

export const update = async (id: number, update: Partial<AuthfileUser>) => {
    const authfile = await get() as AuthfileUser[];
    const user = authfile.find((x) => x.id === id);

    if (!user) {
      throw createError('User Not Found');
    }

    if (update.username && user.username !== update.username) {
      if (
        authfile.find(
          (x) => x.username.toLowerCase() === update.username?.toLowerCase(),
        )
      ) {
        throw createError(
          `User with username '${update.username}' already exists.`,
        );
      }

    //   logger.log(
    //     `Updated user: Changed username from '${user.username}' to '${update.username}'`,
    //   );
      user.username = update.username;
    }

    user.roles = update.roles === undefined ? user.roles : update.roles;
    user.hashedPassword = update.hashedPassword === undefined ? user.hashedPassword : update.hashedPassword;
    user.refreshToken = update.refreshToken === undefined ? user.refreshToken : update.refreshToken;

    // update the auth.json
    saveAuthFile(authfile);
    // this.logger.log(`Updated user: ${user.username}: ${Object.keys(update)}`);

    return desensitiseUserProfile(user);
  }

    /**
   * Remove a user
   * @param id
   */
    const deleteUser = async (id: number) => {
        const authfile = await get() as AuthfileUser[];
    
        const index = authfile.findIndex((x) => x.id === id);
    
        if (index < 0) {
          throw createError('User Not Found');
        }
    
        // prevent deleting the only admin user
        if (
          authfile[index].roles &&
          authfile.filter((x) => x.roles.includes('admin') === true).length < 2
        ) {
          throw createError('Cannot delete only admin user');
        }
    
        authfile.splice(index, 1);
    
        // update the auth.json
        await saveAuthFile(authfile);
        // this.logger.warn(`Deleted user with ID ${id}`);
      }