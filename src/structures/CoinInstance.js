import { ObjectID } from 'mongodb';
import { database } from '../database';
import random from '../utils/random';

const collection = (async () => (await database()).collection('coin_instances'))();
const dateStart = new Date(2020, 10, 8);

export const generateConditionRoll = function generateCoinInstanceCoditionRoll() {
  return random.real(0, 1, true);
};

export const processConditionRoll = function processCoinInstanceConditionRoll(roll) {
  if (roll === 0 || roll === 1) return roll;
  if (roll < 0.5) return 1 - processConditionRoll(1 - roll);
  return (((2 * roll - 1) ** 2.2) / 2) + 0.5;
};

const genReference = function generateReferenceID(number) {
  const dateNow = new Date();
  return `${
    Math.floor((dateNow - dateStart) / 86400000).toString(36).padStart(3, '0')
  }${
    number.toString(36).padStart(3, '0')
  }`.toUpperCase();
};

/**
 * @typedef {Object} CoinInstanceOptions
 * @property {import('mongodb').ObjectID} [_id]
 * @property {import('mongodb').ObjectID} [_coinID]
 * @property {import('mongodb').ObjectID} [_accountID]
 * @property {number} [reference]
 * @property {number} [conditionRoll]
 * @property {number} [condition]
 * @property {number} [conditionNatural]
 * @property {number} [value]
 * @property {boolean} [isAltered]
 * @property {Date} [insertedAt]
 */

export default class CoinInstance {
  constructor(options = {}) {
    this._id = undefined;
    this._coinID = undefined;
    this._accountID = undefined;
    this.reference = undefined;
    this.conditionRoll = generateConditionRoll();
    this.condition = processConditionRoll(this.conditionRoll);
    this.conditionNatural = this.condition;
    this.value = 0;
    this.isAltered = false;
    this.insertedAt = new Date();
    Object.assign(this, options);
    if (typeof this.reference === 'undefined') this.reference = random.integer(0, 46656);
    if (typeof this.reference === 'number') this.reference = genReference(this.reference);
  }

  get grade() {
    const { condition } = this;
    switch (true) {
      case (condition >= 1.00): return 'Mint';
      case (condition >= 0.95): return 'Mint-';
      case (condition >= 0.85): return 'Good+';
      case (condition >= 0.75): return 'Good';
      case (condition >= 0.65): return 'Good-';
      case (condition >= 0.55): return 'Average+';
      case (condition >= 0.45): return 'Average';
      case (condition >= 0.35): return 'Average-';
      case (condition >= 0.25): return 'Bad+';
      case (condition >= 0.15): return 'Bad';
      case (condition >= 0.05): return 'Bad-';
      case (condition >= 0.01): return 'Terrible';
      default: return 'Cum Ridden';
    }
  }

  /**
   * @returns {import('./Coin').default}
   */
  get coin() {
    return new Promise((resolve, reject) => {
      import('./Coin').then((module) => {
        const Coin = module.default;
        resolve(Coin.getByObjectID(this._coinID));
      }).catch(reject);
    });
  }

  get series() {
    return new Promise((resolve, reject) => {
      this.coin.then((coin) => resolve(coin.series)).catch(reject);
    });
  }

  get account() {
    if (this._accountID === null) return undefined;
    return new Promise((resolve, reject) => {
      import('./Coin').then((module) => {
        const Account = module.default;
        resolve(Account.getByObjectID(this._accountID));
      }).catch(reject);
    });
  }

  renderURL(options = {}) {
    const { size = 256 } = options;
    return `${
      process.env.NODE_ENV === 'production'
        ? 'https://collector.soggypiggy.com'
        : 'http://73.255.152.184:3000'
    }/render/coin/${this.reference}?size=${size}`;
  }

  friendlyValue() {
    return CoinInstance.friendlyValue(this.value);
  }

  async structure(scope) {
    return (await this.series).structure(scope);
  }

  static get collection() { return collection; }

  /**
   * @param {CoinInstanceOptions} options
   * @param {import('./Account').default} account
   * @param {import('./Coin').default} coin
   * @returns {CoinInstance}
   */
  static async new(options, account, coin) {
    const coinInstance = CoinInstance.generate(options, account, coin);
    return CoinInstance.insert(coinInstance);
  }

  /**
   * @param {CoinInstance} coinInstance
   */
  static async insert(coinInstance, attempt = 1) {
    try {
      const { insertedId } = await (await collection).insertOne(coinInstance);
      return new CoinInstance({ ...coinInstance, _id: insertedId });
    } catch (error) {
      if (error.code !== 11000) throw error;
      if (attempt > 10) throw error;
      return CoinInstance.insert({ ...coinInstance, reference: genReference() }, attempt + 1);
    }
  }

  /**
   * @param {CoinInstance[]} coinInstances
   * @param {?Number} attempt
   * @returns {CoinInstance[]}
   */
  static async insertBulk(coinInstances, attempt = 1) {
    const { insertedIds } = await (await collection).bulkWrite(
      coinInstances.map((insertOne) => ({ insertOne })),
    );
    const processedInstances = coinInstances.map((coinInstance, index) => new CoinInstance({
      ...coinInstance,
      _id: insertedIds[index],
    }));
    let problemInstances = processedInstances
      .filter((coinInstance) => !(coinInstance._id instanceof ObjectID));
    if (problemInstances.length <= 0) return processedInstances;
    if (attempt > 10) return [];
    problemInstances = problemInstances.map((coinInstance) => new CoinInstance({
      ...coinInstance,
      _id: undefined,
      reference: genReference(),
    }));
    return [
      ...processedInstances,
      ...(await CoinInstance.insertBulk(problemInstances, attempt + 1)),
    ];
  }

  /**
   * @param {CoinInstanceOptions} options
   * @param {import('./Account').default} account
   * @param {import('./Coin').default} coin
   * @returns {CoinInstance}
   */
  static generate(options, account, coin) {
    return new CoinInstance({
      ...options,
      _accountID: account._id,
      _coinID: coin._id,
    });
  }

  /**
   * @param {ObjectID} _id
   * @returns {Coin}
   */
  static async getByObjectID(_id) {
    return CoinInstance.find({ _id });
  }

  /**
   * @param {String} reference
   * @returns {CoinInstance}
   */
  static async getByReference(reference) {
    return CoinInstance.find({ reference });
  }

  static async find(query = {}) {
    const coin = await (await collection).findOne(query);
    if (coin === null) return undefined;
    return new CoinInstance(coin);
  }

  static allFromAccount(account) {
    return CoinInstance.all({ _accountID: account._id });
  }

  static async all(query = {}, options = {}) {
    const cursor = await (await collection).find(query, options);
    cursor.map((document) => new CoinInstance(document));
    return cursor.toArray();
  }

  static async updateBulk(items) {
    if (!Array.isArray(items)) return;
    if (items.length <= 0) return;
    (await collection).bulkWrite(items.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: item },
      },
    })));
  }

  /**
   * @param {CoinInstance[]} coins
   */
  static sort(coins) {
    return coins.sort((a, b) => b.insertedAt - a.insertedAt);
  //   return new Promise((resolveMain) => {
  //     Promise.all(coins.map((coinInstance) => new Promise((resolve) => {
  //       Promise.all([
  //         coinInstance.structure(),
  //         coinInstance.coin,
  //       ]).then((items) => resolve([...items, coinInstance]));
  //     }))).then((results) => resolveMain(
  //       results
  //         .sort(([seriesA, coinA, coinInstanceA], [seriesB, coinB, coinInstanceB]) => {
  //           return seriesA[0].name > seriesB[0].name
  //           // for (let i = 0; i < Math.max(seriesA.length, seriesB.length); i += 1) {
  //           //   const serA = seriesA[i];
  //           //   const serB = seriesB[i];
  //           //   if (typeof serA === 'undefined') return 1;
  //           //   if (typeof serB === 'undefined') return -1;
  //           //   if (serA.name !== serB.name) return serA.name > serB.name;
  //           // }
  //           // if (coinA.name !== coinB.name) return coinA.name > coinB.name;
  //           // if (coinInstanceA.reference === coinInstanceB.reference) return 1;
  //           // return (coinInstanceA.insertedAt > coinInstanceB.insertedAt);
  //         })
  //         .map(([, , coin]) => coin),
  //     ));
  //   });
  }

  static friendlyValue(value = 0) {
    const sections = `${Math.floor(value * 100) / 100}`.split('.');
    return `¤${sections[0]}.${sections[1] ? `${sections[1]}`.padEnd(2, '0') : '00'}`;
  }
}
