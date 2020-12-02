import Logger from './Logger';
import { database } from '../database';

const collection = (async () => (await database()).collection('claim_logs'))();

export default class ClaimLogger extends Logger {
  constructor(options = {}) {
    super();
    this._accountID = undefined;
    this.hash = undefined;
    Object.assign(this, options);
    delete this.before;
    delete this.after;
  }

  async log() {
    const { insertedId } = await (await collection).insertOne(this);
    this._id = insertedId;
    return this;
  }

  static get collection() { return collection; }

  static get transactions() {
    return ['claimed'];
  }

  static async log(logger) {
    return logger.log();
  }

  static async hasClaimed(hash, account) {
    return (await ClaimLogger.find({ hash, _accountID: account._id })) !== undefined;
  }

  static newClaim(hash, account, note) {
    return new ClaimLogger({
      hash,
      note,
      _accountID: account._id,
      transaction: 'claimed',
    });
  }

  static async find(query = {}, options = {}) {
    const log = await (await collection).findOne(query, options);
    if (log === null) return undefined;
    return new ClaimLogger(log);
  }
}
