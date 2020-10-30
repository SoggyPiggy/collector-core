import { database } from '../database';

export const dbCollection = async function getDatabaseCollectionCoin() {
  return (await database()).collection('settings');
};

export default class Setting {
  static async get(key, fallback) {
    const collection = await dbCollection();
    return new Promise((resolve) => {
      collection.findOne({ _id: key })
        .catch(() => resolve(fallback))
        .then(({ value }) => resolve(value));
    });
  }

  static async set(key, value) {
    const collection = await dbCollection();
    return collection.updateOne(
      { key },
      { key, value },
      { upsert: true },
    );
  }
}
