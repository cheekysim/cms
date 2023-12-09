import { error, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import bcrypt from 'bcrypt';

import { db } from '$lib/server/db';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		console.log(request.url);
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();
		if (!username || !password) return error(400);

		const dbuser = (await db.read('users', { username }))[0];

		if (!dbuser) return { status: 401, body: 'Username or Password Incorrect.' };

		const userPassword = await bcrypt.compare(password, dbuser.password);
		if (!userPassword) return { status: 401, body: 'Username or Password Incorrect.' };

		const expires = new Date();
		expires.setHours(expires.getHours() + 1);

		await db.write('sessions', { user: dbuser._id.toString(), expires });
		const { _id } = (await db.read('sessions', { user: dbuser._id.toString(), expires }))[0];

		cookies.set('session', _id.toString(), {
			path: '/',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7
		});

		const url = new URL(request.url);

		const redirectTo = url.searchParams.get('redirectTo') || 'dashboard';

		throw redirect(302, `/${redirectTo}`);
	}
};
