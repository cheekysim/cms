import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/types';
import { handleSessionCheck } from '$lib/handleSessionCheck';
import { getUser } from '$lib/server/getUser';

export const load = (async (event) => {
	console.log('Checking User Auth');
	handleSessionCheck(event);
	const session = event.cookies.get('session');
	const userData: User = await getUser(session);

	return {
		username: userData.username,
		isAdmin: userData.role === 'admin'
	};
}) satisfies LayoutServerLoad;
