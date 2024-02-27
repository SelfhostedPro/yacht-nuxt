import type { AuthfileUser, User } from '~/types/users'
import * as argon2 from 'argon2';

import { findByUsername } from './users/info';

/**
 * Authenticate a user with their credentials
 * @param username
 * @param password
 */
const authenticate = async (
    username: string,
    password: string,
    otp?: string,
): Promise<any> => {
    try {
        const user: AuthfileUser = await findByUsername(username);
        if (!user) {
            throw createError('forbidden');
        }
        await checkPassword(user, password);
        if (user.otpActive && !otp) {
            // throw new HttpException('2FA Code Required', 412);
        }

        // if (user.otpActive && !this.verifyOtpToken(user, otp)) {
            // throw new HttpException('2FA Code Invalid', 412);
        // }

        if (user) {
            return {
                id: user.id,
                username: user.username,
                roles: user.roles,
                // instanceId: this.configService.instanceId,
            };
        }
    } catch (e) {
        // if (e instanceof ForbiddenException) {
        //     this.logger.warn(`Failed login attempt for ${username}.`);
        //     this.logger.warn(
        //         "If you've forgotten your password you can reset to the default " +
        //         `of admin/admin by deleting the "auth.json" file (${this.configService.authPath}) and then restarting Yacht.`,
        //     );
        //     throw e;
        // }

        // if (e instanceof HttpException) {
        //     throw e;
        // }

        // throw new ForbiddenException();
        throw createError('forbidden')
    }
}

/**
 * Verify as users username and password
 * This will throw an error if the credentials are incorrect.
 */
const checkPassword = async (user: AuthfileUser, loginPassword: string) => {
    const config = await useConfig()
    const passwordMatches = await argon2.verify(
        user.hashedPassword,
        loginPassword,
        {
            secret: Buffer.from(config.secrets.accessSecret)
        }
    );

    if (passwordMatches) {
        return user;
    } else {
        throw createError('forbidden');
    }
}
