import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from './db';

export const handleSessionCheck = async (event: RequestEvent) => {
	// Delete all expired sessions
	await db.deleteMany('sessions', { expires: { $lt: new Date() } });

	const session = event.cookies.get('session');
	if (session) {
		const exists = (await db.read('sessions', { id: session }))[0];
		if (exists) {
			// If session is not expired, update the expiration time
			const expires = new Date();
			expires.setHours(expires.getHours() + 1);
			await db.update('sessions', { id: session }, { $set: { expires: expires } });
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

export const handleZoneCheck = async (event: RequestEvent) => {
	const session = (await db.read('sessions', { id: event.cookies.get('session') }))[0];
	if (!session) {
		throw redirect(302, '/login');
	}
	const zoneID = event.params.zone;
	const zone = (await db.read('zones', { user: session.user, id: zoneID }))[0];
	if (!zone) {
		throw redirect(302, '/dashboard');
	}
	return;
};
