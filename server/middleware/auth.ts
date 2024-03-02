// Library provided middleware: https://lucia-auth.com/getting-started/nuxt
import { verifyRequestOrigin } from "lucia";
import type { Session, User } from "lucia";
import { type YachtConfig } from "~/types/config";

const publicRoutes = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/wizard",
  "/api/settings/details"
]

export default defineEventHandler(async (event) => {
  // Check to see if auth is enabled
  const { auth, theme } = await useConfig()
  event.context.details = { auth, theme }

  if (event.context.details.auth === false) return

  if (event.method !== "GET") {
    const originHeader = getHeader(event, "Origin") ?? null;
    const hostHeader = getHeader(event, "Host") ?? null;
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
      return event.node.res.writeHead(403).end();
    }
  }

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null;
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
    details: Pick<YachtConfig, 'auth' | 'theme'>
    user: User | null;
    session: Session | null;
  }
}