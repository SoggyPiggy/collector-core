import { database } from '../database';

export const dbCollection = async function getDatabaseCollectionCoin() {
  return (await database()).collection('accounts');
};

export const cacheAccount = new Map();
export const cacheDiscordID = new Map();

/**
 * @typedef {Object} AccountOptions
 * @property {import('mongodb').ObjectID} [_id]
 * @property {string} [discordID]
 * @property {string} [discordUsername]
 * @property {number} [scrap]
 * @property {boolean} [isAdmin]
 * @property {boolean} [isAdminEnabled]
 * @property {boolean} [settingSendNotifications]
 * @property {boolean} [discordiaTechDemoInvite]
 * @property {Date} [insertedAt]
 */

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
    this.insertedAt = new Date();
    Object.assign(this, options);
  }

  get adminOverride() { return this.isAdmin && this.isAdminEnabled; }

  static get collection() { return dbCollection(); }

  /**
   * @param {AccountOptions} options
   */
  static async new(options) {
    const collection = await dbCollection();
    const account = new Account(options);
    return new Promise((resolve, reject) => {
      collection.insertOne(account)
        .catch(reject)
        .then(({ insertedId }) => resolve(new Account({ ...account, _id: insertedId })));
    });
  }

  /**
   * @param {import('discord.js').User} user
   * @returns {Account}
   */
  static async getByDiscordUser(user) {
    if (cacheDiscordID.has(user.id)) {
      const _id = cacheDiscordID(user.id);
      if (cacheAccount.has(_id)) return cacheAccount.get(_id);
    }
    return Account.find({ discordID: user.id });
  }

  static async getByID(id) {
    return Account.find({ _id: id });
  }

  static async find(params) {
    const collection = await dbCollection();
    return new Promise((resolve, reject) => {
      collection.findOne(params)
        .catch(reject)
        .then((account) => {
          if (account === null) resolve(undefined);
          else {
            cacheAccount.set(account._id, account);
            cacheDiscordID.set(account.discordID, account._id);
            resolve(new Account(account));
          }
        });
    });
  }
}
