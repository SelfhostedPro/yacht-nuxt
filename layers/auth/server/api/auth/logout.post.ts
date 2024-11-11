// import { authHooks } from "~/server/utils/auth";
import { useLucia } from "../../utils/auth";
export default eventHandler(async (event) => {
	const lucia = useLucia()
	if (!event.context.session) {
		throw createError({
			statusCode: 403
		});
	}
	await lucia.invalidateSession(event.context.session.id);
	appendHeader(event, "Set-Cookie", lucia.createBlankSessionCookie().serialize());
	// await authHooks.callHook('logout', event.context.session.id)
	return { status: 'success', message: 'logged out' }
});