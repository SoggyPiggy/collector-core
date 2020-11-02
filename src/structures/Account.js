import { database } from '../database';

export const dbCollection = async function getDatabaseCollectionCoin() {
  return (await database()).collection('accounts');
};

export default class Account {
  constructor(options = {}) {
    this._id = undefined;
    this.discordID = '0';
    this.discordUsername = '';
    this.scrap = 0;
    this.isAdmin = false;
    this.isAdminEnabled = false;
    this.settingSendNotifications = true;
    this.discordiaTechDemoInvite = false;
    Object.assign(this, options);
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
    return Account.find({ _id: id });
  }

  static async find(params) {
    const collection = await dbCollection();
    return new Promise((resolve, reject) => {
      collection.findOne(params)
        .catch(reject)
        .then((coin) => {
          if (coin === null) resolve(undefined);
          else resolve(new Account(coin));
        });
    });
  }
}
