import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/types';
import { checkSession } from '$lib/server/checkSession';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies: Cookies }) => {
	console.log('Checking User Auth');
	const session = Cookies.get('session') || '';
	const userData: User = await checkSession(session);

	if (!userData) {
		console.log('User Not Authenticated');
		throw redirect(302, '/login');
	}

	return {
		username: userData.username,
		isAdmin: userData.role === 'admin'
	};
}) satisfies LayoutServerLoad;
