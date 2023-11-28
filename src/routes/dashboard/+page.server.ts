import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { getUser } from '$lib/server/getUser';
import { redirect } from '@sveltejs/kit';
import type { User, Zone } from '$lib/types';

export const load = (async ({ cookies }) => {
	const session = cookies.get('session');
	if (!session) {
		throw redirect(302, '/login');
	}
	const user: User = await getUser(session);
	if (!user) {
		throw redirect(302, '/login');
	}

	const dbzones = await db.read('zones', { user: user.id });
	const zones: Zone[] = dbzones.map((z) => ({
		id: z.id,
		name: z.name
	}));
	return { zones };
}) satisfies PageServerLoad;
