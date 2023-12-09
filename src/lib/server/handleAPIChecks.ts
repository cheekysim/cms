import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export const handleToken = async (requestEvent: RequestEvent) => {
	// Check if Auth header is present & Bearer
	if (!requestEvent.request.headers.has('Authorization')) {
		return new Response(JSON.stringify({ message: 'No Authorization header present' }), {
			status: 401
		});
	}
	const authHeader = requestEvent.request.headers.get('Authorization');

	if (!authHeader?.startsWith('Bearer ')) {
		return new Response(JSON.stringify({ message: 'Authorization header is not Bearer' }), {
			status: 401
		});
	}

	// Check if token is valid
	const token = authHeader.replace('Bearer ', '');
	const tokenData = await db.read('tokens', { token });
	if (tokenData.length === 0) {
		return new Response(JSON.stringify({ message: 'Token is invalid' }), {
			status: 401
		});
	}

	// Check if token is expired
	const tokenExpires = tokenData[0].expires;
	if (tokenExpires < Date.now()) {
		return new Response(JSON.stringify({ message: 'Token is expired' }), {
			status: 401
		});
	}

	return tokenData[0];
};
