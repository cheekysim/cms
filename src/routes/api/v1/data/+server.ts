import type { RequestHandler } from './$types';
import { handleToken } from '$lib/server/handleAPIChecks';

export const GET: RequestHandler = async (request) => {
	const tokenData = await handleToken(request);
	if (tokenData instanceof Response) return tokenData;
	console.log(tokenData);
	return new Response(JSON.stringify({ message: 'Hello World!' }));
};
