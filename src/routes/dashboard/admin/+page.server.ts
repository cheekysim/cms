import type { PageServerLoad } from './$types';
import type { User } from '$lib/types';
import { getUser } from '$lib/server/getUser';
import { redirect } from '@sveltejs/kit';
import { handleSessionCheck } from '$lib/handleSessionCheck';

export const load = (async (event) => {
	console.log('Checking User Auth');
	handleSessionCheck(event);
	const userData: User = await getUser(event.cookies.get('session'));

	if (userData.role !== 'admin') {
		console.log('User Not Admin');
		throw redirect(302, '/dashboard');
	}

	return {
		username: userData.username,
		isAdmin: userData.role === 'admin'
	};
}) satisfies PageServerLoad;
