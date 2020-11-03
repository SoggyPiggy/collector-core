import { database } from '../database';

const collection = (async () => (await database()).collection('settings'))();

export default class Setting {
  static async get(key, fallback) {
    const result = (await collection).findOne({ key });
    if (
      typeof result === 'object'
      && result !== null
      && typeof result.value !== 'undefined'
    ) return result.value;
    return Setting.set(key, fallback);
  }

  static async set(key, value) {
    await (await collection).updateOne({ key }, { $set: { key, value } }, { upsert: true });
    return value;
  }
}
