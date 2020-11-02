import { database } from '../database';

export const dbCollection = async function getDatabaseCollectionCoin() {
  return (await database()).collection('series');
};

export default class Series {
  constructor(options = {}) {
    this._id = undefined;
    this._seriesID = undefined;
    this.name = '';
    this.directory = './';
    Object.assign(this, options);
  }

  static get collection() { return dbCollection(); }
}
