import { MongoClient } from 'mongodb';

const uri = encodeURI(process.env.DATABASE_CONNECTION_STRING);

export const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const database = async function mongoDatabase() {
  await client.connect();
  return client.db('collector');
};
