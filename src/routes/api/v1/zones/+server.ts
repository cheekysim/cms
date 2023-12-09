import type { RequestHandler } from './$types';
import { handleToken } from '$lib/server/handleAPIChecks';
import { db } from '$lib/server/db';

export const GET: RequestHandler = async (request) => {
	const tokenData = await handleToken(request);
	if (tokenData instanceof Response) return tokenData;
	const zones = await db.read('zones', { user: tokenData.userid });
	if (zones.length === 0) {
		return new Response(JSON.stringify({ message: 'No zones found' }), {
			status: 404
		});
	}
	console.log(zones);
	return new Response(JSON.stringify({ zones: [...zones] }));
};
