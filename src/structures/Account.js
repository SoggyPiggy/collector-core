import { database } from '../database';

export const dbCollection = async function getDatabaseCollectionCoin() {
  return (await database()).collection('accounts');
};

export default class Account {
  constructor({
    _id,
    _postgresID,
    discordID,
    discordUsername,
    scrap = 0,
    isAdmin = false,
    isAdminEnabled = false,
  }) {
    this._id = _id;
    this._postgresID = _postgresID;
    this.discordID = discordID;
    this.discordUsername = discordUsername;
    this.scrap = scrap;
    this.isAdmin = isAdmin;
    this.isAdminEnabled = isAdminEnabled;
  }

  get adminOverride() { return this.isAdmin && this.isAdminEnabled; }

  static get collection() { return dbCollection(); }

  static async new(params) {
    const collection = await dbCollection();
    return new Promise((resolve, reject) => {
      const account = new Account(typeof params === 'string' ? { discordId: params } : params);
      collection.insertOne(new Account(params))
        .catch(reject)
        .then((coin) => resolve(new Account(coin)));
    });
  }

  static async get(id) {
    const collection = await dbCollection();
    return new Promise((resolve, reject) => {
      collection.findOne({ _id: id })
        .catch(reject)
        .then((coin) => resolve(new Account(coin)));
    });
  }
}
