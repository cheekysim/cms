import * as mongodb from 'mongodb';
import { MONGO_IP, MONGO_DB, MONGO_USER, MONGO_PASS } from '$env/static/private';

class MongoDB {
	private client: mongodb.MongoClient;
	private database: string;

	constructor(ip: string, database: string, user: string, pass: string) {
		const url = new URL(
			`mongodb://${user}:${pass}@${ip}:27017/${database}?authMechanism=DEFAULT&authSource=admin`
		);
		this.database = database;
		this.client = new mongodb.MongoClient(url.toString());
	}

	async read(Collection: string, query: object = {}, sort: mongodb.Sort = {}) {
		console.log(`Reading ${Collection}`);
		const con = await this.client.connect();
		const collection = con.db(this.database).collection(Collection);
		return await collection.find(query).sort(sort).toArray();
	}

	async writeMany(Collection: string, data: object[]) {
		if (data.length === 0) {
			console.log(`No data to write to ${Collection}`);
			return;
		}
		console.log(`Writing ${Collection}`);
		const con = await this.client.connect();
		const collection = con.db(this.database).collection(Collection);
		return await collection.insertMany(data);
	}

	async write(Collection: string, data: object) {
		if (Object.keys(data).length === 0) {
			console.log(`No data to write to ${Collection}`);
			return;
		}
		console.log(`Writing ${Collection}`);
		const con = await this.client.connect();
		const collection = con.db(this.database).collection(Collection);
		return await collection.insertOne(data);
	}

	async update(Collection: string, query: object, data: object) {
		if (Object.keys(data).length === 0) {
			console.log(`No data to write to ${Collection}`);
			return;
		}
		console.log(`Updating ${Collection}`);
		const con = await this.client.connect();
		const collection = con.db(this.database).collection(Collection);
		return await collection.updateOne(query, data);
	}

	async replace(Collection: string, query: object, data: object) {
		if (Object.keys(data).length === 0) {
			console.log(`No data to write to ${Collection}`);
			return;
		}
		console.log(`Updating ${Collection}`);
		const con = await this.client.connect();
		const collection = con.db(this.database).collection(Collection);
		return await collection.replaceOne(query, data);
	}

	async deleteOne(Collection: string, query: object) {
		console.log(`Deleting ${Collection}`);
		const con = await this.client.connect();
		const collection = con.db(this.database).collection(Collection);
		return await collection.deleteOne(query);
	}

	async deleteMany(Collection: string, query: object) {
		console.log(`Deleting ${Collection}`);
		const con = await this.client.connect();
		const collection = con.db(this.database).collection(Collection);
		return await collection.deleteMany(query);
	}

	async drop(Collection: string) {
		console.log(`Dropping ${Collection}`);
		const con = await this.client.connect();
		if (await this.collectionExists(Collection)) {
			return await con.db(this.database).collection(Collection).drop();
		} else {
			return false;
		}
	}

	async listCollections() {
		const con = await this.client.connect();
		return await con.db(this.database).listCollections().toArray();
	}

	async close() {
		await this.client.close();
		console.log('Disconnected from MongoDB');
	}

	async collectionExists(Collection: string) {
		const con = await this.client.connect();
		const collections = (await con.db(this.database).listCollections().toArray()).map(
			(collection: { name: string }) => collection.name
		);
		console.log(
			`Collection: ${Collection} ${collections.includes(Collection) ? 'exists' : 'does not exist'}`
		);
		return collections.includes(Collection);
	}
}

const db = new MongoDB(MONGO_IP, MONGO_DB, MONGO_USER, MONGO_PASS);

export { MongoDB, db };

export default {
	MongoDB
};