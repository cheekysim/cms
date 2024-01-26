import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from './db';
import { ObjectId } from 'mongodb';

export const handleSessionCheck = async (event: RequestEvent) => {
	// Delete all expired sessions
	await db.deleteMany('sessions', { expires: { $lt: new Date() } });

	const session = event.cookies.get('session');
	if (session) {
		const exists = (await db.read('sessions', { _id: new ObjectId(session) }))[0];
		if (exists) {
			// If session is not expired, update the expiration time
			const expires = new Date();
			expires.setHours(expires.getHours() + 1);
			await db.update('sessions', { _id: new ObjectId(session) }, { $set: { expires: expires } });
			event.cookies.set('session', session, {
				path: '/',
				sameSite: 'strict',
				maxAge: 60 * 60 * 24 * 7
			});
			return;
		}
	}
	const redirectTo = event.url.pathname + event.url.search;
	throw redirect(302, `/login?redirectTo=${redirectTo.slice(1)}&error=Session%20Expired`);
};

export const handleDomainCheck = async (event: RequestEvent) => {
	const session = (
		await db.read('sessions', { _id: new ObjectId(event.cookies.get('session')) })
	)[0];
	if (!session) {
		throw redirect(302, '/login');
	}
	const domainID = new ObjectId(event.params.domain);
	const domain = (await db.read('domains', { user: session.user, _id: new ObjectId(domainID) }))[0];
	if (!domain) {
		throw redirect(302, '/dashboard');
	}
	return;
};
