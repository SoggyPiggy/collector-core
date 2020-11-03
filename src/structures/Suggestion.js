import {
  database,
  insertOne,
} from '../database';

const collection = (async () => (await database()).collection('suggestions'))();

/**
 * @typedef {Object} SuggestionOptions
 * @property {import('mongodb').ObjectID} [_id]
 * @property {import('mongodb').ObjectID} [_accountID]
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
    this.content = '';
    this.discordUsername = '';
    this.insertedAt = new Date();
    Object.assign(this, options);
  }

  static get collection() { return collection; }

  /**
   * Create a new Suggestion
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
    return new Suggestion(await insertOne(collection, suggestion));
  }

  /**
   * Get all suggestions from an Account
   * @param {import('./Account').default} account
   * @returns {Suggestion[]}
   */
  static async allFromAccount(account) {
    return Suggestion.all({ _accountID: account._id });
  }

  /**
   * Get all suggestions that match the query
   * @param {SuggestionOptions} query
   * @param {import('mongodb').FindOneOptions} options
   * @returns {Suggestion[]}
   */
  static async all(query = {}, options = {}) {
    const documents = await ((await collection).find(query, options).toArray());
    return documents.map((suggestion) => new Suggestion(suggestion));
    // return whateverTheFuckThisIs.map();
  }
}
