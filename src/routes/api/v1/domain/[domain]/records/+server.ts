import type { RequestHandler } from './$types';
import { ObjectId } from 'mongodb';
import { db } from '$lib/server/db';
import { handleToken } from '$lib/server/handleAPIChecks';

export const GET: RequestHandler = async (request) => {
	const tokenData = await handleToken(request);
	if (tokenData instanceof Response) {
		return tokenData;
	}
	const domain = request.params.domain;
	if (!domain) {
		return new Response(JSON.stringify({ message: 'Domain not specified' }), { status: 400 });
	}

	const domaindb = (
		await db.read('domains', { _id: new ObjectId(domain), user: tokenData.userid })
	)[0];

	if (!domaindb) {
		return new Response(JSON.stringify({ message: 'Domain not found' }), { status: 404 });
	}

	const records = await db.read('records', { domain: domain });

	return new Response(JSON.stringify(records), { status: 200 });
};
