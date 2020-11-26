import Logger from './Logger';
import {
  database,
  insertOne,
} from '../database';

const collection = (async () => (await database()).collection('coin_instance_logs'))();

export default class CoinInstanceLogger extends Logger {
  constructor(options = {}) {
    super();
    this._accountID = undefined;
    this._coinInstanceID = undefined;
    Object.assign(this, options);
  }

  log() { return CoinInstanceLogger.log(this); }

  static get collection() { return collection; }

  static get transactions() {
    return [
      'collected',
      'scrapped',
      'repaired',
      'claimed',
    ];
  }

  static async log(logger) {
    return new CoinInstanceLogger(await insertOne(collection, logger));
  }

  static newCollectLog(coinInstance, account, note) {
    return new CoinInstanceLogger({
      note,
      _accountID: account._id,
      _coinInstanceID: coinInstance._id,
      transaction: 'collected',
    }).setAfter(coinInstance);
  }

  static newClaimLog(coinInstance, account, note) {
    return new CoinInstanceLogger({
      note,
      _accountID: account._id,
      _coinInstanceID: coinInstance._id,
      transaction: 'claimed',
    }).setAfter(coinInstance);
  }

  static newScrappedlLog(coinInstance, account, note) {
    return new CoinInstanceLogger({
      note,
      _accountID: account._id,
      _coinInstanceID: coinInstance._id,
      transaction: 'scrapped',
    }).setBefore(coinInstance);
  }

  static newRepairedLog(coinInstance, account, note) {
    return new CoinInstanceLogger({
      note,
      _accountID: account._id,
      _coinInstanceID: coinInstance._id,
      transaction: 'repaired',
    }).setBefore(coinInstance);
  }
}
