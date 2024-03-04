import { Lucia } from "lucia";
import { BetterSqlite3Adapter } from "@lucia-auth/adapter-sqlite";

import { rawDB } from "./db";
import type { DBUser } from "~/types/auth";


const adapter = new BetterSqlite3Adapter(rawDB, {
    user: 'user',
    session: 'session'
});

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

