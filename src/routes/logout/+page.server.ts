import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { deleteSession } from '$lib/server/deleteSession';
import { ObjectId } from 'mongodb';

export const load = (async ({ cookies }) => {
	const id = cookies.get('session');
	if (id) {
		cookies.delete('session', { path: '/' });
		await deleteSession(new ObjectId(id));
	}
	throw redirect(302, '/');
}) satisfies PageServerLoad;
