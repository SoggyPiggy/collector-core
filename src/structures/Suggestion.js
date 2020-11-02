import { database } from '../database';

export const dbCollection = async function getDatabaseCollectionCoin() {
  return (await database()).collection('suggestions');
};

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

  static get collection() { return dbCollection(); }

  /**
   * Create a new Suggestion
   * @param {import('./Account').default} account
   * @param {string} content
   * @returns {Suggestion}
   */
  static async new(account, content) {
    const collection = await dbCollection();
    const { _id, discordUsername } = account;
    const suggestion = new Suggestion({
      content,
      discordUsername,
      _accountID: _id,
    });
    return new Promise((resolve, reject) => {
      collection.insertOne(suggestion)
        .catch(reject)
        .then(({ insertedId }) => resolve(new Suggestion({ ...suggestion, _id: insertedId })));
    });
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
    const collection = await dbCollection();
    const documents = await (collection.find(query, options).toArray());
    return documents.map((suggestion) => new Suggestion(suggestion));
    // return whateverTheFuckThisIs.map();
  }
}
