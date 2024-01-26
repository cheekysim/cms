import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { getUser } from '$lib/server/getUser';
import type { User, Domain } from '$lib/types';

export const load = (async ({ cookies }) => {
	const session = cookies.get('session');
	const user: User = await getUser(session);

	const dbdomains = await db.read('domains', { user: user._id });
	const domains: Domain[] = dbdomains.map((z) => ({
		_id: z._id.toString(),
		name: z.name,
		user: z.user
	}));
	return { domains };
}) satisfies PageServerLoad;
