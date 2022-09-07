import dotenv from 'dotenv';
dotenv.config({ path: './env/.env.test' });
import { jest } from '@jest/globals'
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
jest.setTimeout(60000);

let mongoDb;

beforeAll(async () => {
	mongoDb = await MongoMemoryServer.create({ instance: { port: 27018 }, autoStart: false });
	await mongoose.connect(mongoDb.getUri(), { dbName: 'betfisher_test' });
})

afterAll(async () => {
	await mongoose.disconnect();
	await mongoDb.stop();
});
