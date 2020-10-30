import random from '../utils/random';
import { database } from '../database';

export const dbCollection = async function getDatabaseCollectionCoin() {
  return (await database()).collection('coins');
};

export default class Coin {
  constructor({
    _id,
    _postgresID,
    seriesID = undefined,
    name = 'UNDEFINED',
    directory = '_coin',
    directoryTails = '_coin',
    weight = (() => random.integer(750, 1000))(),
    value = 0,
    inCirculation = true,
    isRetired = false,
    isError = false,
  }) {
    this._id = _id;
    this._postgresID = _postgresID;
    this.seriesID = seriesID;
    this.name = name;
    this.directory = directory;
    this.directoryTails = directoryTails;
    this.weight = weight;
    this.value = value;
    this.inCirculation = inCirculation;
    this.isRetired = isRetired;
    this.isError = isError;
  }

  static get collection() { return dbCollection(); }

  static async new(series, params) {
    const collection = await dbCollection();
    return new Promise((resolve, reject) => {
      collection.insertOne(new Coin({ ...params, seriesID: series._id }))
        .catch(reject)
        .then((coin) => resolve(new Coin(coin)));
    });
  }

  static async get(id) {
    const collection = await dbCollection();
    return new Promise((resolve, reject) => {
      collection.findOne({ _id: id })
        .catch(reject)
        .then((coin) => resolve(new Coin(coin)));
    });
  }

  static async findOne(...params) {
    const collection = await dbCollection();
    return new Promise((resolve, reject) => {
      collection.findOne(...params)
        .catch(reject)
        .then((coin) => resolve(new Coin(coin)));
    });
  }

  static async find(...params) {
    const collection = await dbCollection();
    return new Promise((resolve, reject) => {
      collection.find(...params)
        .catch(reject)
        .then((coins) => resolve(coins.map((coin) => new Coin(coin))));
    });
  }
}
