import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/types';
import { user } from '$lib/stores/user';
import { redirect } from '@sveltejs/kit';

export const load = (async () => {
	console.log('Checking User Auth');

	let userData: User = {
		username: '',
		password: '',
		role: 'user'
	};

	user.subscribe((data) => {
		console.log(data);
		if (data && data.username) {
			userData = data;
		} else {
			console.log('User not logged in');
			throw redirect(302, '/login');
		}
	});

	return {
		username: userData.username,
		isAdmin: userData.role === 'admin'
	};
}) satisfies LayoutServerLoad;
