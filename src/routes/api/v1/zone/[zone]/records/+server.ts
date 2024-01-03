import type { RequestHandler } from './$types';
import { ObjectId } from 'mongodb';
import { db } from '$lib/server/db';
import { handleToken } from '$lib/server/handleAPIChecks';

export const GET: RequestHandler = async (request) => {
	const tokenData = await handleToken(request);
	if (tokenData instanceof Response) {
		return tokenData;
	}
	const zone = request.params.zone;
	if (!zone) {
		return new Response(JSON.stringify({ message: 'Zone not specified' }), { status: 400 });
	}

	const zonedb = (await db.read('zones', { _id: new ObjectId(zone), user: tokenData.userid }))[0];

	if (!zonedb) {
		return new Response(JSON.stringify({ message: 'Zone not found' }), { status: 404 });
	}

	const records = await db.read('records', { zone: zone });

	return new Response(JSON.stringify(records), { status: 200 });
};
