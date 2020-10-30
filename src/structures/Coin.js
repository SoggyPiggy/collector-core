import random from '../utils/random';
import { database } from '../database';

export const dbCollection = async function getDatabaseCollectionCoin() {
  return (await database()).collection('coins');
};

/**
 * @typedef {import('bson').ObjectID} ObjectID
 */

/**
 * @typedef {object} CoinOptions
 * @property {ObjectID} [_id]
 * @property {number} [_postgresID]
 * @property {ObjectID} [seriesID]
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
    this._postgresID = undefined;
    this.seriesID = undefined;
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

  static get collection() { return dbCollection(); }

  /**
   * Create a new coin
   * @param {import('./Series').default} series
   * @param {CoinOptions} options
   * @returns {Coin}
   */
  static async new(series, options) {
    const collection = await dbCollection();
    const coin = new Coin({ ...options, seriesID: series._id });
    return new Promise((resolve, reject) => {
      collection.insertOne(coin)
        .catch(reject)
        .then(({ insertedId }) => resolve(new Coin({ ...coin, _id: insertedId })));
    });
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
    const collection = await dbCollection();
    return new Promise((resolve, reject) => {
      collection.findOne(query)
        .catch(reject)
        .then((coin) => resolve(new Coin(coin)));
    });
  }
}
