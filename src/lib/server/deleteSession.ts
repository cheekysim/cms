import { db } from './db';
import type { ObjectId } from 'mongodb';

export const deleteSession = async (id: ObjectId) => {
	db.deleteMany('sessions', { _id: id });
};
