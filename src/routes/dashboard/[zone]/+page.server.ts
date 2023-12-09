import type { PageServerLoad } from './$types';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { User, Zone } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { getUser } from '$lib/server/getUser';
import { error } from '@sveltejs/kit';
import { ObjectId } from 'mongodb';
import { handleSessionCheck, handleZoneCheck } from '$lib/server/handleChecks';

export const load = (async (event) => {
	await handleSessionCheck(event);
	await handleZoneCheck(event);

	const user: User = await getUser(event.cookies.get('session'));

	const zonedb = (await db.read('zones', { _id: new ObjectId(event.params.zone), user: user.id }))[0];

	const zone: Zone = {
		id: zonedb._id.toString(),
		name: zonedb.name,
		user: zonedb.user
	};

	const dbrecords = await db.read('records', { zone: zone.id });

	const records = JSON.stringify(dbrecords);

	return { zone: zone.name, records: records };
}) satisfies PageServerLoad;

async function newRecord({ request, params, cookies }: RequestEvent) {
	const session = cookies.get('session');
	if (!session) {
		throw redirect(302, '/login');
	}

	const user: User = await getUser(session);
	if (!user) {
		throw redirect(302, '/login');
	}

	const zone = (await db.read('zones', { _id: new ObjectId(params.zone), user: user.id }))[0];

	if (!zone) {
		throw redirect(302, '/dashboard');
	}

	const data = await request.formData();
	const name = data.get('name')?.toString();
	const type = data.get('type')?.toString() || 'text';
	const content = data.get('content')?.toString();

	if (!name || !type || !content) return error(400);

	db.write('records', {
		name,
		type,
		content,
		zone: zone._id
	});

	throw redirect(302, `/dashboard/${zone._id}`);
}

async function saveRecords({ request, params, cookies }: RequestEvent) {
	const session = cookies.get('session');
	if (!session) {
		throw redirect(302, '/login');
	}

	const user: User = await getUser(session);
	if (!user) {
		throw redirect(302, '/login');
	}

	const zone = (await db.read('zones', { _id: new ObjectId(params.zone), user: user.id }))[0];

	if (!zone) {
		throw redirect(302, '/dashboard');
	}

	const currentRecords = await db.read('records', { zone: zone._id.toString() });

	const data = await request.formData();
	const IDs = new Set(data.getAll('id'));

	for (const record of currentRecords) {
		if (!IDs.has(record._id.toString())) {
			db.deleteOne('records', { _id: record._id });
		}
	}

	console.log(IDs);

	for (const id of IDs) {
		const name = data.get(`name-${id}`)?.toString();
		const type = data.get(`type-${id}`)?.toString() || 'text';
		const content = data.get(`content-${id}`)?.toString();

		console.log({ name, type, content, id });

		if (!name || !type || !content) return error(400);

		const record = currentRecords.find((r) => r._id.toString() === id);

		if (!record) throw error(404);

		record.name = name;
		record.type = type;
		record.content = content;

		db.update('records', { _id: record._id }, { $set: record });
	}

	throw redirect(302, `/dashboard/${zone.id}`);
}

export const actions: Actions = {
	save: async (event: RequestEvent) => saveRecords(event),
	new: async (event: RequestEvent) => newRecord(event)
};
