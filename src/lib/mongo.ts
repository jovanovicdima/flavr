import { MongoClient } from 'mongodb';
import { MONGO_PASSWORD, MONGO_USER, MONGO_PORT, MONGO_HOST } from '$env/static/private';

const uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/`;
const client: MongoClient = await new MongoClient(uri).connect();

export default client;
