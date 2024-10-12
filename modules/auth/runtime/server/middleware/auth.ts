// Library provided middleware: https://lucia-auth.com/getting-started/nuxt
import { verifyRequestOrigin } from "lucia";
import type { Session, User } from "lucia";
import type { YachtConfig } from "~~/modules/config/types"
import { useLucia } from '../utils/auth';
import { useConfig } from '~~/modules/config/runtime/server/utils/config';
import { getHeader, getCookie, createError, appendResponseHeader } from 'h3'

const publicRoutes = [
    "/api/auth/login",
    "/api/auth/logout",
    "/api/auth/wizard",
    "/api/settings/details",
    "/_nuxt/*"
]

export default defineEventHandler(async (event) => {
    const lucia = useLucia()
    // Check to see if auth is enabled
    const { auth, theme, name } = await useConfig()
    event.context.details = { auth, theme, name }
    if (event.context.details.auth === false) return

    if (event.method !== "GET") {
        const originHeader = getHeader(event, "Origin") ?? null;
        const hostHeader = getHeader(event, "Host") ?? null;
        if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
            return event.node.res.writeHead(403).end();
        }
    }

    const sessionId = getCookie(event, lucia.sessionCookieName) ?? null
    if (!sessionId) {
        if (
            event.path.startsWith('/api') &&
            !publicRoutes.map((publicPath) => event.path === publicPath ? true : false).includes(true)
        ) {
            throw createError({
                statusCode: 401,
                message: `unauthorized request to ${event.path}`
            })
        }
        event.context.session = null;
        event.context.user = null;
        return;
    }


    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
        appendResponseHeader(
            event,
            "Set-Cookie",
            lucia.createSessionCookie(session.id).serialize()
        );
    }
    if (!session) {
        appendResponseHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize());
    }
    event.context.session = session;
    event.context.user = user;
});

declare module "h3" {
    interface H3EventContext {
        details: Pick<YachtConfig, 'auth' | 'theme' | 'name'>
        user: User | null;
        session: Session | null;
    }
}