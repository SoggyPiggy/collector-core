import { database } from '../database';
import random from '../utils/random';

const collection = (async () => (await database()).collection('suggestions'))();

/**
 * @typedef {Object} SuggestionOptions
 * @property {import('mongodb').ObjectID} [_id]
 * @property {import('mongodb').ObjectID} [_accountID]
 * @property {number} [reference]
 * @property {string} [content]
 * @property {string} [discordUsername]
 * @property {Date} [insertedAt]
 */

export default class Suggestion {
  /**
   * @param {SuggestionOptions} options
   */
  constructor(options = {}) {
    this._id = undefined;
    this._accountID = undefined;
    this.reference = random.integer(0, 1679616);
    this.content = '';
    this.discordUsername = '';
    this.insertedAt = new Date();
    Object.assign(this, options);
  }

  get ref() { return this.reference.toString(36).toUpperCase().padStart(4, '0'); }

  static get collection() { return collection; }

  /**
   * @param {import('./Account').default} account
   * @param {string} content
   * @returns {Suggestion}
   */
  static async new(account, content) {
    const { _id, discordUsername } = account;
    const suggestion = new Suggestion({
      content,
      discordUsername,
      _accountID: _id,
    });

    try {
      const { instertedId } = await (await collection).insertOne();
      suggestion._id = instertedId;
      return suggestion;
    } catch (error) {
      if (
        error.code === 11000
        && typeof error.keyPattern.reference !== 'undefined'
      ) return Suggestion.new(account, content);
      throw error;
    }
  }

  /**
   * @param {import('./Account').default} account
   * @returns {Suggestion[]}
   */
  static async allFromAccount(account) {
    return Suggestion.all({ _accountID: account._id });
  }

  /**
   * @param {SuggestionOptions} query
   * @param {import('mongodb').FindOneOptions} options
   * @returns {Suggestion[]}
   */
  static async all(query = {}, options = {}) {
    const documents = await ((await collection).find(query, options).toArray());
    return documents.map((suggestion) => new Suggestion(suggestion));
  }
}
