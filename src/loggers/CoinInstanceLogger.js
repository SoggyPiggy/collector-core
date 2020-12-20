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

  get account() {
    return new Promise((resolve, reject) => {
      import('../structures').then((module) => {
        const { Account } = module;
        resolve(Account.getByObjectID(this._accountID));
      }).catch(reject);
    });
  }

  get coinInstance() {
    return new Promise((resolve, reject) => {
      import('../structures').then((module) => {
        const { CoinInstance } = module;
        resolve(CoinInstance.getByObjectID(this._coinInstanceID));
      }).catch(reject);
    });
  }

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

  static getLastCollect(account) {
    return CoinInstanceLogger.find({
      _accountID: account._id,
      transaction: 'collected',
    }, {
      sort: [['timestamp', -1]],
    });
  }

  static async find(query = {}, options = {}) {
    const log = await (await collection).findOne(query, options);
    if (log === null) return undefined;
    return new CoinInstanceLogger(log);
  }

  static async getCount(account, transaction = 'collected') {
    return (await collection).countDocuments({ transaction, _accountID: account._id });
  }
}
