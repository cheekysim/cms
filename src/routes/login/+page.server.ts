import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import bcrypt from 'bcrypt';

import { db } from '$lib/server/db';

const generateID = (currentIDs: string[]) => {
	let r = Math.random().toString(36).substring(7);
	if (currentIDs.includes(r)) r = generateID(currentIDs);
	return r;
};

export const actions: Actions = {
	default: async ({ request, cookies: Cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();
		if (!username || !password) return error(400);

		const dbuser = (await db.read('users', { username }))[0];

		if (!dbuser) return { status: 401, body: 'Username or Password Incorrect.' };

		const userPassword = await bcrypt.compare(password, dbuser.password);
		if (!userPassword) return { status: 401, body: 'Username or Password Incorrect.' };

		const currentSessions = await db.read('sessions');
		const sessionId = generateID(currentSessions.map((s) => s.sessionId));

		const expires = new Date();
		expires.setHours(expires.getHours() + 1);

		db.write('sessions', { id: sessionId, username, expires });

		Cookies.set('session', sessionId, {
			path: '/',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7
		});

		throw redirect(302, '/dashboard');
	}
};
