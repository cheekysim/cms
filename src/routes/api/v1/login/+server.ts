import { MongoDB } from '$lib/server/db';
import { MONGO_IP, MONGO_DB, MONGO_USER, MONGO_PASS } from '$env/static/private';

const db = new MongoDB(MONGO_IP, MONGO_DB, MONGO_USER, MONGO_PASS);

export const GET = async ({ request }) => {
	const data = await request.json();
	console.log(data);
	await db.write('users', data);
	return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
};
