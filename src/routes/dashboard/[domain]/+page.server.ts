import type { PageServerLoad } from './$types';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { User, Domain } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import { getUser } from '$lib/server/getUser';
import { error } from '@sveltejs/kit';
import { ObjectId, type WithId } from 'mongodb';
import { handleSessionCheck, handleDomainCheck } from '$lib/server/handleChecks';

export const load = (async (event) => {
	await handleSessionCheck(event);
	await handleDomainCheck(event);

	const user: User = await getUser(event.cookies.get('session'));

	const domaindb = (
		await db.read('domains', { _id: new ObjectId(event.params.domain), user: user._id })
	)[0];

	const domain: Domain = {
		_id: domaindb._id.toString(),
		name: domaindb.name,
		user: domaindb.user
	};

	const dbrecords = await db.read('records', { domain: domain._id });

	const records = JSON.stringify(dbrecords);
	console.log(records);

	return { domain: domain.name, records: records };
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

	const domain = (
		await db.read('domains', { _id: new ObjectId(params.domain), user: user._id })
	)[0];

	if (!domain) {
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
		domain: domain._id.toString()
	});

	updateWebsite(domain);

	throw redirect(302, `/dashboard/${domain._id}`);
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

	const domain = (
		await db.read('domains', { _id: new ObjectId(params.domain), user: user._id })
	)[0];

	if (!domain) {
		throw redirect(302, '/dashboard');
	}

	const currentRecords = await db.read('records', { domain: domain._id.toString() });

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

	updateWebsite(domain);

	throw redirect(302, `/dashboard/${domain._id.toString()}`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function updateWebsite(domain: WithId<any>) {
	if (!domain.cms_url || !domain.cms_token) return;

	const records = await db.read('records', { domain: domain._id.toString() });

	const body = JSON.stringify({ ...records });

	console.log(body);

	const res = await fetch(domain.cms_url, {
		headers: { Authorization: `Bearer ${domain.cms_token}` },
		method: 'POST',
		body
	});
	const status = res.status;

	if (status !== 200) {
		console.log(await res.text());
	}

	return status;
}

export const actions: Actions = {
	save: async (event: RequestEvent) => saveRecords(event),
	new: async (event: RequestEvent) => newRecord(event)
};
