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
}
