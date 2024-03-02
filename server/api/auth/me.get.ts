import { type User } from "lucia";

export default defineEventHandler((event): User | null => {
	return event.context.user;
});