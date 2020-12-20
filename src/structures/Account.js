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

  async stats() {
    const modules = await Promise.all([
      import('./CoinInstance'),
      import('../loggers/CoinInstanceLogger'),
      import('../loggers/AccountLogger'),
    ]);
    const [
      CoinInstance,
      CoinInstanceLogger,
      AccountLogger,
    ] = modules.map((module) => module.default);
    /** @type {import('./CoinInstance').default[]} */
    const coins = (await CoinInstance.allFromAccount(this)).sort((a, b) => b.value - a.value);
    const stats = { coins };
    // stats.coinsUniqueCount = new Set(coins.map((coin) => coin._coinID)).size;
    stats.coinsValueTotal = coins.reduce((previous, instance) => previous + instance.value, 0);
    stats.coinsValueAvg = stats.coinsValueTotal / coins.length;
    [stats.coinsMVC] = coins;
    stats.coinsLVC = coins[coins.length - 1];
    stats.logsCoinsCollected = await CoinInstanceLogger.getCount(this, 'collected');
    stats.logsCoinsScrapped = await CoinInstanceLogger.getCount(this, 'scrapped');
    stats.logsCoinsClaimed = await CoinInstanceLogger.getCount(this, 'claimed');
    stats.logsCoinsRepaired = await CoinInstanceLogger.getCount(this, 'repaired');
    stats.logsAccountScrapWithdrawl = await AccountLogger.aggregateScrap(this, 'scrap-withdrawl');
    stats.logsAccountScrapDeposit = await AccountLogger.aggregateScrap(this, 'scrap-deposit');
    return stats;
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

  /**
   * @param {AccountOptions} query
   * @param {import('mongodb').FindOneOptions} options
   * @returns {Account[]}
   */
  static async all(query = {}, options = {}) {
    const cursor = await (await collection).find(query, options);
    cursor.map((document) => new Account(document));
    return cursor.toArray();
  }
}
