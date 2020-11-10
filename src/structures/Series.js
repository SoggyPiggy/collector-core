import { database } from '../database';

const collection = (async () => (await database()).collection('series'))();

/**
 * @typedef {Object} SeriesOptions
 * @property {import('mongodb').ObjectID} [_id]
 * @property {import('mongodb').ObjectID} [_seriesID]
 * @property {string} [name]
 * @property {string} [directory]
 */

export default class Series {
  /**
   * @param {SeriesOptions} options
   */
  constructor(options = {}) {
    this._id = undefined;
    this._seriesID = undefined;
    this.name = '';
    this.directory = './';
    Object.assign(this, options);
  }

  get series() {
    return Series.find({ _id: this._seriesID });
  }

  static get collection() { return collection; }

  /**
   * @param {SeriesOptions} options
   * @param {Series|null} series
   * @returns {Series}
   */
  static async new(options, series) {
    const newSeries = new Series(options);
    if (typeof series !== 'undefined') {
      newSeries._seriesID = series._id;
    }
    const { insertedId } = await (await collection).insertOne(newSeries);
    newSeries._id = insertedId;
    return newSeries;
  }

  /**
   * @param {SeriesOptions} query
   * @returns {Series|undefined}
   */
  static async find(query = {}) {
    const series = await (await collection).findOne(query);
    if (series === null) return undefined;
    return new Series(series);
  }
}
