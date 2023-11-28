import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/deleteSession';

export const load = (async ({ cookies }) => {
	const sessionId = cookies.get('session');
	if (sessionId) {
		cookies.delete('session', { path: '/' });
		await deleteSession(sessionId);
	}
	throw redirect(302, '/');
}) satisfies PageServerLoad;
