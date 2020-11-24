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
 * @property {string} [flavorText]
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
    this.flavorText = undefined;
    this.directory = '_coin';
    this.weight = (() => random.integer(750, 1000))();
    this.value = 0;
    this.inCirculation = true;
    this.isRetired = false;
    this.isError = false;
    Object.assign(this, options);
  }

  get series() {
    return new Promise((resolve, reject) => {
      import('./Series').then((module) => {
        const Series = module.default;
        resolve(Series.find({ _id: this._seriesID }));
      }).catch(reject);
    });
  }

  async structure(scope) {
    return (await this.series).structure(scope);
  }

  static get collection() { return collection; }

  /**
   * @param {CoinOptions} options
   * @param {import('./Series').default} series
   * @returns {Coin}
   */
  static async new(options, series) {
    const coin = new Coin({ ...options, _seriesID: series._id });
    const { insertedId } = await (await collection).insertOne(coin);
    coin._id = insertedId;
    return coin;
  }

  /**
   * @param {CoinOptions[]} options
   * @param {import('./Series').default} series
   * @returns {Coin[]}
   */
  static async newBulk(options, series) {
    const coins = options.map((option) => new Coin({ ...option, _seriesID: series._id }));
    const results = await (await collection).bulkWrite(coins.map((coin) => ({ insertOne: coin })));
    return coins.map((coin, index) => {
      const { _id } = results.result.insertedIds[`${index}`];
      return new Coin({ ...coin, _id });
    });
  }

  /**
   * @param {ObjectID} _id
   * @returns {Coin}
   */
  static async getByObjectID(_id) {
    return Coin.find({ _id });
  }

  /**
   * @param {CoinOptions} query
   * @returns {Coin}
   */
  static async find(query = {}) {
    const coin = await (await collection).findOne(query);
    if (coin === null) return undefined;
    return new Coin(coin);
  }

  /**
   * @param {CoinOptions} query
   * @param {object} options
   * @returns {Coin[]}
   */
  static async all(query = {}, options = {}) {
    const cursor = await (await collection).find(query, options);
    cursor.map((document) => new Coin(document));
    return cursor.toArray();
  }

  /**
   * @param {import('./Series').default} series
   * @returns {Coin[]}
   */
  static async allFromSeries(series) {
    const Series = (await import('./Series')).default;
    return Series.all({ _seriesID: series._id });
  }

  /**
   * @param {import('./Series').default} series
   * @returns {Coin[]}
   */
  static async allFromSeriesRecursive(series) {
    if (typeof series === 'undefined') return [];
    return [
      ...(await this.allFromSeries(series)),
      ...(await this.allFromSeriesRecursive(await series.series)),
    ];
  }
}
