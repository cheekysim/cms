import { MongoDB } from '$lib/server/db';
import { MONGO_IP, MONGO_DB, MONGO_USER, MONGO_PASS } from '$env/static/private';

const db = new MongoDB(MONGO_IP, MONGO_DB, MONGO_USER, MONGO_PASS);

export const GET = async () => {
	const urls = await db.read('urls');
	return new Response(JSON.stringify(urls), { status: 200 });
};
