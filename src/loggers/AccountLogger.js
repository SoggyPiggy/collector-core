import Logger from './Logger';
import {
  database,
  insertOne,
} from '../database';

const collection = (async () => (await database()).collection('account_logs'))();

export default class AccountLogger extends Logger {
  constructor(options = {}) {
    super();
    this._accountID = undefined;
    Object.assign(this, options);
  }

  log() { return AccountLogger.log(this); }

  static get collection() { return collection; }

  static get transactions() {
    return [
      'account-created',
      'scrap-withdrawl',
      'scrap-deposit',
    ];
  }

  static async log(logger) {
    return new AccountLogger(await insertOne(collection, logger));
  }

  static newAccountCreationLog(account, note) {
    return new AccountLogger({
      note,
      _accountID: account._id,
      transaction: 'account-created',
    }).setAfter(account);
  }

  static newScrapWithdrawlLog(account, note) {
    return new AccountLogger({
      note,
      _accountID: account._id,
      transaction: 'scrap-withdrawl',
    }).setBefore(account);
  }

  static newScrapDepositLog(account, note) {
    return new AccountLogger({
      note,
      _accountID: account._id,
      transaction: 'scrap-deposit',
    }).setBefore(account);
  }
}
