import { Lucia } from "lucia";
import { adapter } from "./db";
import type { DBUser } from "~/types/auth";
import { createHooks } from 'hookable'

// export interface AuthHooks {
//     [hook: string]: <T, R>(data: T) => R | void
// }

interface AuthHooks {
    login: (session: string) => void,
    logout: (session: string) => void,
}

export const authHooks = createHooks<AuthHooks>()

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        // IMPORTANT!
        attributes: {
            // set to `true` when using HTTPS
            secure: false
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

// IMPORTANT!
declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseUserAttributes: Omit<DBUser, "id">;
    }
}

