import { database } from '../database';

const collection = (async () => (await database()).collection('series'))();

export default class Series {
  constructor(options = {}) {
    this._id = undefined;
    this._seriesID = undefined;
    this.name = '';
    this.directory = './';
    Object.assign(this, options);
  }

  static get collection() { return collection; }

  static async new(options, series) {
    const newSeries = new Series(options);
    if (typeof series !== 'undefined') {
      newSeries._seriesID = series._id;
    }
    const { insertedId } = (await collection).insertOne(newSeries);
    newSeries._id = insertedId;
    return newSeries;
  }
}
