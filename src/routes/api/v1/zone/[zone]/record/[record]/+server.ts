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

	const record = request.params.record;
	if (!record) {
		return new Response(JSON.stringify({ message: 'Record not specified' }), { status: 400 });
	}

	const zonedb = (await db.read('zones', { _id: new ObjectId(zone), user: tokenData.userid }))[0];

	if (!zonedb) {
		return new Response(JSON.stringify({ message: 'Zone not found' }), { status: 404 });
	}

	let recorddb;
	if (record.length === 24) {
		recorddb = (await db.read('records', { _id: new ObjectId(record), zone: zone }))[0];
	} else {
		recorddb = (await db.read('records', { name: record, zone: zone }))[0];
	}

	if (!recorddb) {
		return new Response(JSON.stringify({ message: 'Record not found' }), { status: 404 });
	}


	return new Response(JSON.stringify(recorddb), { status: 200 });
};
