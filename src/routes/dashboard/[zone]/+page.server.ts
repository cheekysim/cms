import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import type { User } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { getUser } from '$lib/server/getUser';

export const load = (async ({ params, cookies }) => {
	const session = cookies.get('session');
	if (!session) {
		throw redirect(302, '/login');
	}

	const user: User = await getUser(session);
	if (!user) {
		throw redirect(302, '/login');
	}

	const zone = (await db.read('zones', { id: params.zone, user: user.id }))[0];

	if (!zone) {
		throw redirect(302, '/dashboard');
	}
	return { zone: zone.name };
}) satisfies PageServerLoad;
