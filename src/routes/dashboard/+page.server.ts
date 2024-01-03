import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { getUser } from '$lib/server/getUser';
import type { User, Zone } from '$lib/types';

export const load = (async ({ cookies }) => {
	const session = cookies.get('session');
	const user: User = await getUser(session);

	const dbzones = await db.read('zones', { user: user._id });
	const zones: Zone[] = dbzones.map((z) => ({
		_id: z._id.toString(),
		name: z.name,
		user: z.user
	}));
	return { zones };
}) satisfies PageServerLoad;
