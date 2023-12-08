import { db } from './db';
import { redirect } from '@sveltejs/kit';
import type { User } from '$lib/types';

export const getUser = async (sessionID: string | undefined): Promise<User> => {
	if (!sessionID) {
		throw redirect(302, '/login');
	}
	const sessions = await db.read('sessions', { id: sessionID });
	if (!sessions.length) {
		throw redirect(302, '/login');
	}
	const userid = sessions[0].user;
	const user = (await db.read('users', { id: userid }))[0];
	const userData: User = {
		id: user.id,
		username: user.username,
		role: user.role
	};
	return userData;
};
