import random from '../utils/random';
import {
  database,
  insertOne,
  findOne,
} from '../database';

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
   * Create a new coin
   * @param {import('./Series').default} series
   * @param {CoinOptions} options
   * @returns {Coin}
   */
  static async new(series, options) {
    return new Coin(await insertOne(collection, new Coin({ ...options, _seriesID: series._id })));
  }

  /**
   * Get one coin based on its _id property
   * @param {ObjectID} id
   * @returns {Coin}
   */
  static async get(id) {
    return Coin.find({ _id: id });
  }

  /**
   * Get one coin based on its properties
   * @param {CoinOptions} query
   * @returns {Coin}
   */
  static async find(query = {}) {
    return new Coin(await findOne(collection, query));
  }
}
