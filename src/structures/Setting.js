import { database } from '../database';

export const dbCollection = async function getDatabaseCollectionCoin() {
  return (await database()).collection('settings');
};

export default class Setting {
  static async get(key, fallback) {
    // TODO: Add actual shit to make this work, scrapped the old error riddled functions
    return fallback;
  }

  static async set(key, value) {
    return value;
  }
}
