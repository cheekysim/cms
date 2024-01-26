import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	return new Response('All Systems Operational', { status: 200 });
};
