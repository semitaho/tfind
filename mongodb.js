import mongodb  from 'mongodb';

export default mongodb;
export const URI = process.env.MONGOLAB_URI;
export var mongoClient = mongodb.MongoClient;
export var mongoConnection = mongoClient.connect(URI);


