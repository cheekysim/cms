import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/deleteSession';

export const load = (async ({ cookies }) => {
	const id = cookies.get('session');
	if (id) {
		cookies.delete('session', { path: '/' });
		await deleteSession(id);
	}
	throw redirect(302, '/');
}) satisfies PageServerLoad;
