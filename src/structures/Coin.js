import random from '../utils/random';
import { database } from '../database';

const collection = (async () => (await database()).collection('coins'))();

/**
 * @typedef {import('bson').ObjectID} ObjectID
 */

/**
 * @typedef {object} CoinOptions
 * @property {ObjectID} [_id]
 * @property {ObjectID} [_seriesID]
 * @property {string} [name]
 * @property {string} [directory]
 * @property {string} [directoryTails]
 * @property {number} [weight]
 * @property {number} [value]
 * @property {boolean} [inCirculation]
 * @property {boolean} [isRetired]
 * @property {boolean} [isError]
 */

export default class Coin {
  /**
   * @param {CoinOptions} options
   */
  constructor(options = {}) {
    this._id = undefined;
    this._seriesID = undefined;
    this.name = undefined;
    this.directory = '_coin';
    this.directoryTails = '_coin';
    this.weight = (() => random.integer(750, 1000))();
    this.value = 0;
    this.inCirculation = true;
    this.isRetired = false;
    this.isError = false;
    Object.assign(this, options);
  }

  static get collection() { return collection; }

  /**
   * @param {CoinOptions} options
   * @param {import('./Series').default} series
   * @returns {Coin}
   */
  static async new(options, series) {
    const coin = new Coin({ ...options, _seriesID: series._id });
    const { insertedId } = (await collection).insertOne(coin);
    coin._id = insertedId;
    return coin;
  }

  /**
   * @param {ObjectID} id
   * @returns {Coin}
   */
  static async getByObjectID(id) {
    return Coin.find({ _id: id });
  }

  /**
   * @param {CoinOptions} query
   * @returns {Coin}
   */
  static async find(query = {}) {
    return new Coin(await (await collection).findOne(query));
  }
}
