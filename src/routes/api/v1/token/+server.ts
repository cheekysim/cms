import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import { db } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	const { username, password } = await request.json();

	// Match username and password with db
	const user = (await db.read('users', { username }))[0];
	if (!user) {
		return new Response(JSON.stringify({ message: 'Username || Password : Incorrect' }), {
			status: 404
		});
	}
	const match = await bcrypt.compare(password, user.password);
	if (!match) {
		return new Response(JSON.stringify({ message: 'Username || Password : Incorrect' }), {
			status: 404
		});
	}

	// Generate a token
	const token = await bcrypt.hash(`${username}-${password}`, 10);
	const expires = new Date(Date.now());
	expires.setMonth(expires.getMonth() + 1);
	await db.deleteMany('tokens', { expires: { $lt: Date.now() } });
	await db.deleteMany('tokens', { userid: user._id });
	await db.write('tokens', { userid: user._id, token, expires });

	// Return token
	return new Response(JSON.stringify({ token }), { status: 200 });
};
