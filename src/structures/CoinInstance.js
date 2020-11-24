import { database } from '../database';
import random from '../utils/random';

const collection = (async () => (await database()).collection('coin_instances'))();

export const generateConditionRoll = function generateCoinInstanceCoditionRoll() {
  return random.real(0, 1, true);
};

export const processConditionRoll = function processCoinInstanceConditionRoll(roll) {
  if (roll === 0 || roll === 1) return roll;
  if (roll < 0.5) return 1 - processConditionRoll(1 - roll);
  return (((2 * roll - 1) ** 2.2) / 2) + 0.5;
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
    this.reference = random.integer(0, 2176782336);
    this.conditionRoll = generateConditionRoll();
    this.condition = processConditionRoll(this.conditionRoll);
    this.conditionNatural = this.condition;
    this.value = 0;
    this.isAltered = false;
    this.insertedAt = new Date();
    Object.assign(this, options);
  }

  get ref() { return this.reference.toString(36).toUpperCase().padStart(6, '0'); }

  get grade() {
    switch (true) {
      case (this.condition >= 1.00): return 'Mint';
      case (this.condition >= 0.95): return 'Mint-';
      case (this.condition >= 0.85): return 'Good+';
      case (this.condition >= 0.75): return 'Good';
      case (this.condition >= 0.65): return 'Good-';
      case (this.condition >= 0.55): return 'Average+';
      case (this.condition >= 0.45): return 'Average';
      case (this.condition >= 0.35): return 'Average-';
      case (this.condition >= 0.25): return 'Bad+';
      case (this.condition >= 0.15): return 'Bad';
      case (this.condition >= 0.05): return 'Bad-';
      case (this.condition >= 0.01): return 'Terrible';
      default: return 'Cum Ridden';
    }
  }

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
    if (typeof this._accountID === 'undefined') return undefined;
    return new Promise((resolve, reject) => {
      import('./Coin').then((module) => {
        const Account = module.default;
        resolve(Account.getByObjectID(this._accountID));
      }).catch(reject);
    });
  }

  static get collection() { return collection; }

  /**
   * @param {CoinInstanceOptions} options
   * @param {import('./Account').default} account
   * @param {import('./Coin').default} coin
   * @returns {CoinInstance}
   */
  static async new(options, account, coin) {
    const coinInstance = new CoinInstance({
      ...options,
      _accountID: account._id,
      _coinID: coin._id,
    });
    try {
      const { insertedId } = await (await collection).insertOne(coinInstance);
      coinInstance._id = insertedId;
      return coinInstance;
    } catch (error) {
      if (
        error.code === 11000
        && typeof error.keyPattern.reference !== 'undefined'
      ) {
        delete coinInstance.reference;
        return CoinInstance.new({ ...coinInstance }, account, coin);
      }
      throw error;
    }
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
    return CoinInstance.find({ reference: parseInt(reference, 36) });
  }

  static async find(query = {}) {
    const coin = await (await collection).findOne(query);
    if (coin === null) return undefined;
    return new CoinInstance(coin);
  }
}
