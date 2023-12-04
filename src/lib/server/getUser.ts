import { db } from './db';
import { redirect } from '@sveltejs/kit';
import type { User } from '$lib/types';

export const getUser = async (id: string | undefined): Promise<User> => {
	if (!id) {
		throw redirect(302, '/login');
	}
	const sessions = await db.read('sessions', { id });
	if (!sessions.length) {
		throw redirect(302, '/login');
	}
	const username = sessions[0].username;
	const user = (await db.read('users', { username }))[0];
	const userData: User = {
		id: user.id,
		username: user.username,
		role: user.role
	};
	return userData;
};
