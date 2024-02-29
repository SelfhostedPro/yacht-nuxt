// Library provided middleware: https://lucia-auth.com/getting-started/nuxt
import { verifyRequestOrigin } from "lucia";
import type { Session, User } from "lucia";

const publicRoutes = [
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/wizard",
  "/api/settings/details"
]

export default defineEventHandler(async (event) => {
  // Check to see if auth is enabled
  const authEnabled = (await useConfig()).auth
  // if (!authEnabled) return

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
    user: User | null;
    session: Session | null;
  }
}