import { database } from '../database';

export const dbCollection = async function getDatabaseCollectionCoin() {
  return (await database()).collection('series');
};

export default class Series {
  constructor({
    _id = undefined,
    name = undefined,
    directory = '_default',
    seriesID = undefined,
  }) {
    this._id = _id;
    this.name = name;
    this.directory = directory;
    this.seriesID = seriesID;
  }

  static get collection() { return dbCollection(); }
}
