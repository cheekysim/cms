import type { PageServerLoad } from './$types';
import type { User } from '$lib/types';
import { checkSession } from '$lib/server/checkSession';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ cookies: Cookies }) => {
	console.log('Checking User Auth');
	const session = Cookies.get('session') || '';
	const userData: User = await checkSession(session);

	if (!userData || userData.role !== 'admin') {
		console.log('User Not Admin');
		throw redirect(302, '/dashboard');
	}

	return {
		username: userData.username,
		isAdmin: userData.role === 'admin'
	};
}) satisfies PageServerLoad;
