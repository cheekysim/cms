import type { RequestHandler } from './$types';
import bcrypt from 'bcrypt';
import { db } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	const auth = request.headers.get('authorization')?.split(' ')[1];
	if (!auth) {
		return new Response(JSON.stringify({ message: 'Authorization : Required' }), {
			status: 401 // Unauthorized
		});
	}

	// Verify auth
	const domain = (await db.read('domains', { cms_token: auth }))[0];
	if (!domain) {
		return new Response(JSON.stringify({ message: 'Not Authorized' }), {
			status: 401 // Unauthorized
		});
	}

	// Generate a token
	const token = await bcrypt.hash(auth, 10);
	const expires = new Date(Date.now());
	expires.setMonth(expires.getMonth() + 1);
	await db.deleteMany('tokens', {
		$or: [{ expires: { $lt: Date.now() } }, { userid: domain.user }]
	});
	await db.write('tokens', { userid: domain.user.toString(), token, expires });

	// Return token
	return new Response(JSON.stringify({ token }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
