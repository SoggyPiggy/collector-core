import { database } from '../database';

export const dbCollection = async function getDatabaseCollectionCoin() {
  return (await database()).collection('settings');
};

export default class Setting {
  static async get(key, fallback) {
    const collection = await dbCollection();
    return new Promise((resolve) => {
      collection.findOne({ key })
        .then((result) => {
          if (typeof result === 'object'
            && result !== null
            && typeof result.value !== 'undefined') resolve(result.value);
          else resolve(Setting.set(key, fallback));
        });
    });
  }

  static async set(key, value) {
    const collection = await dbCollection();
    return new Promise((resolve) => {
      collection.updateOne({ key }, { $set: { key, value } }, { upsert: true })
        .then(() => resolve(value));
    });
  }
}
