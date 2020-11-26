import { database } from '../database';
import random from '../utils/random';

const collection = (async () => (await database()).collection('suggestions'))();
const dateStart = new Date(2020, 10, 8);

const genReference = function generateReferenceID(number) {
  const dateNow = new Date();
  return `${
    Math.floor((dateNow - dateStart) / 86400000).toString(36).padStart(3, '0')
  }${
    number.toString(36).padStart(3, '0')
  }`.toUpperCase();
};

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
    this.reference = undefined;
    this.content = '';
    this.discordUsername = '';
    this.insertedAt = new Date();
    Object.assign(this, options);
    if (typeof this.reference === 'undefined') this.reference = random.integer(0, 46656);
    if (typeof this.reference === 'number') this.reference = genReference(this.reference);
  }

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
      const { instertedId } = await (await collection).insertOne(suggestion);
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
