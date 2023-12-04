import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from './server/db';

export const handleSessionCheck = async (event: RequestEvent) => {
	const session = event.cookies.get('session');
	if (session) {
		const exists = (await db.read('sessions', { id: session }))[0];
		if (exists) {
			// If session is expired, delete it and redirect to login
			if (exists.expires < Date.now()) {
				await db.deleteOne('sessions', { id: session });
			}

			// If session is not expired, update the expiration time
			const expires = new Date();
			expires.setHours(expires.getHours() + 1);
			await db.update('sessions', { id: session }, { $set: { expires: expires } });
			return;
		}
	}

	const url = event.url.pathname + event.url.search;
	redirect(302, `/login?redirectTo=${url}`);
};
