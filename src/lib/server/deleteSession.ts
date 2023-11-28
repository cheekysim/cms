import { db } from './db';

export const deleteSession = async (sessionId: string) => {
	db.deleteMany('sessions', { sessionId });
};
