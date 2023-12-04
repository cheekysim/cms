import { db } from './db';

export const deleteSession = async (id: string) => {
	db.deleteMany('sessions', { id });
};
