import { db } from './db';
import { redirect } from '@sveltejs/kit';
import type { User } from '$lib/types';
import { ObjectId } from 'mongodb';

export const getUser = async (sessionID: string | undefined): Promise<User> => {
	if (!sessionID) {
		throw redirect(302, '/login');
	}
	const sessions = await db.read('sessions', { _id: new ObjectId(sessionID) });
	if (!sessions.length) {
		throw redirect(302, '/login');
	}
	const userid = sessions[0].user;
	const user = (await db.read('users', { _id: new ObjectId(userid) }))[0];
	const userData: User = {
		_id: user._id.toString(),
		username: user.username,
		role: user.role
	};
	return userData;
};
