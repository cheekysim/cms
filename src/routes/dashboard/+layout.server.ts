import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/types';
import { handleSessionCheck } from '$lib/server/handleChecks';
import { getUser } from '$lib/server/getUser';

export const load = (async (event) => {
	await handleSessionCheck(event);
	const session = event.cookies.get('session');
	const userData: User = await getUser(session);

	return {
		username: userData.username,
		isAdmin: userData.role === 'admin'
	};
}) satisfies LayoutServerLoad;
