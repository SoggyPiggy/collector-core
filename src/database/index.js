import { MongoClient } from 'mongodb';

const uri = 'mongodb+srv://Soggy:ripazTXlhg7fhm1o@clusterdev.73yxe.mongodb.net/collector?retryWrites=true&w=majority';

export const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export const database = async function mongoDatabase() {
  await client.connect();
  return client.db('collector');
};
