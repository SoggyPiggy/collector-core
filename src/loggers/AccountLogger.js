import Logger from './Logger';
import { database } from '../database';

const collection = (async () => (await database()).collection('account_logs'))();

export default class AccountLogger extends Logger {
  constructor(options = {}) {
    super();
    this._accountID = undefined;
    Object.assign(this, options);
  }

  async log() {
    const { insertedId } = await (await collection).insertOne(this);
    this._id = insertedId;
    return this;
  }

  static get collection() { return collection; }

  static get transactions() {
    return [
      'account-created',
      'scrap-withdrawl',
      'scrap-deposit',
    ];
  }

  static async log(logger) {
    return logger.log();
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
