import { error, redirect } from '@sveltejs/kit';
import { user } from '$lib/stores/user';
import { MONGO_IP, MONGO_DB, MONGO_USER, MONGO_PASS } from '$env/static/private';
import type { Actions, PageServerLoad } from './$types';
import bcrypt from 'bcrypt';

import { MongoDB } from '$lib/server/db';

const db = new MongoDB(MONGO_IP, MONGO_DB, MONGO_USER, MONGO_PASS);

export const load: PageServerLoad = async () => {
	// todo
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();
		if (!username || !password) return error(400);

		const dbuser = (await db.read('users', { username }))[0];

		if (!dbuser) return { status: 401, body: 'Username or Password Incorrect.' };

		const userPassword = await bcrypt.compare(password, dbuser.password);
		if (!userPassword) return { status: 401, body: 'Username or Password Incorrect.' };

		user.update(() => ({ username, password, role: dbuser.role }));

		throw redirect(302, '/dashboard');
	}
};
