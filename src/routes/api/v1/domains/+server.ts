import type { RequestHandler } from './$types';
import { handleToken } from '$lib/server/handleAPIChecks';
import { db } from '$lib/server/db';

export const GET: RequestHandler = async (request) => {
	const tokenData = await handleToken(request);
	if (tokenData instanceof Response) return tokenData;
	const domains = await db.read('domains', { user: tokenData.userid });
	if (domains.length === 0) {
		return new Response(JSON.stringify({ message: 'No domains found' }), {
			status: 404
		});
	}
	console.log(domains);
	return new Response(JSON.stringify({ domains: [...domains] }));
};
