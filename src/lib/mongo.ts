import { MongoClient, ObjectId } from 'mongodb';
import { MONGO_PASSWORD, MONGO_USER, MONGO_PORT, MONGO_HOST } from '$env/static/private';

ObjectId.prototype.toJSON = function () {
	return this.toHexString();
};

const uri = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/`;
const mongo: MongoClient = await new MongoClient(uri).connect();

const mongoFlavr = mongo.db('flavr');

export default mongoFlavr;
