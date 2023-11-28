import { db } from './db';
import type { User } from '$lib/types';

export const checkSession = async (sessionId: string) => {
	await db.deleteMany('sessions', { expires: { $lt: new Date() } });
	const sessions = await db.read('sessions', { sessionId });
	if (!sessions.length) return null;
	const username = sessions[0].username;
	const user = (await db.read('users', { username }))[0];
	const userData: User = {
		username: user.username,
		role: user.role
	};
	return userData;
};
