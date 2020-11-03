import { database } from '../database';

const collection = (async () => (await database()).collection('settings'))();

export default class Setting {
  static async get(key, fallback) {
    const result = await (await collection).findOne({ key });
    if (result === null) return Setting.set(key, fallback);
    return result.value;
  }

  static async set(key, value) {
    await (await collection).updateOne({ key }, { $set: { key, value } }, { upsert: true });
    return value;
  }
}
