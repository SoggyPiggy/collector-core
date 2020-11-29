import { database } from '../database';

const collection = (async () => (await database()).collection('accounts'))();

export const cacheAccount = new Map();
export const cacheDiscordID = new Map();

/**
 * @param {AccountOptions} account
 */
const updateCaches = function updateCachesForAccount(account) {
  cacheAccount.set(account._id, account);
  cacheDiscordID.set(account.discordID, account);
};

/**
 * @param {string} id
 * @returns {Account|undefined}
 */
const findFromCaches = function findFromCachesFromID(id) {
  const _id = cacheDiscordID.has(id) ? cacheDiscordID.get(id) : id;
  return cacheAccount.get(_id);
};

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
  /**
   * @param {AccountOptions} options
   */
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

  save() {
    return Account.update(this);
  }

  static get collection() { return collection; }

  /**
   * @param {AccountOptions} options
   * @returns {Account}
   */
  static async new(options) {
    const account = new Account(options);
    const { insertedId } = await (await collection).insertOne(account);
    account._id = insertedId;
    updateCaches(account);
    return account;
  }

  /**
   * @param {import('discord.js').User} user
   * @returns {Account}
   */
  static async getByDiscordUser(user) {
    let account = findFromCaches(user.id);
    if (typeof account !== 'undefined') return account;
    account = await Account.find({ discordID: user.id });
    account.discordUsername = user.username;
    return account;
  }

  /**
   * @param {string} id
   * @returns {Account}
   */
  static async getByDiscordID(id) {
    const account = findFromCaches(id);
    if (typeof account !== 'undefined') return account;
    return Account.find({ discordID: id });
  }

  /**
   * @param {import('mongodb').ObjectID} id
   * @returns {Account}
   */
  static async getByObjectID(id) {
    const account = findFromCaches(id);
    if (typeof account !== 'undefined') return account;
    return Account.find({ _id: id });
  }

  /**
   * @param {AccountOptions} params
   * @returns {Account|undefined}
   */
  static async find(params) {
    const accountData = await (await collection).findOne(params);
    if (accountData === null) return undefined;
    const account = new Account(accountData);
    updateCaches(account);
    return account;
  }

  /**
   * @param {AccountOptions} account
   */
  static async update(account) {
    (await collection).updateOne(
      { _id: account._id },
      { $set: account },
    );
  }
}
