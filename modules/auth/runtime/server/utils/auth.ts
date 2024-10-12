import { Lucia } from "lucia";
import { createHooks } from 'hookable'
import type { DBUser } from "~~/modules/db/types/user";
import { useDBAdapter } from '~~/modules/db/runtime/server/utils/db'
// export interface AuthHooks {
//     [hook: string]: <T, R>(data: T) => R | void
// }

interface AuthHooks {
    login: (session: string) => void,
    logout: (session: string) => void,
}

export const authHooks = createHooks<AuthHooks>()

export const useLucia = () => {
    return new Lucia(useDBAdapter(), {
        sessionCookie: {
            // IMPORTANT!
            attributes: {
                // set to `true` when using HTTPS
                secure: true
            }
        },
        getUserAttributes: (attributes) => {
            return {
                // attributes has the type of DatabaseUserAttributes
                username: attributes.username,
                role: attributes.role
            };
        }
    });
}



// IMPORTANT!
declare module "lucia" {
    interface Register {
        Lucia: ReturnType<typeof useLucia>;
        DatabaseUserAttributes: Omit<DBUser, "id">;
    }
}