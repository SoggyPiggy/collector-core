/* eslint-disable no-param-reassign */
import { random } from '../utils';
import { database } from '../database';

const dateStart = new Date(2020, 10, 8);

const genReference = function generateReferenceID(number = random.integer(0, 46656)) {
  return [Math.floor((Date.now() - dateStart) / 86400000), number]
    .map((item) => item.toString(36))
    .map((item) => item.padStart(3, '0'))
    .join('')
    .toUpperCase();
};

/**
 * @typedef {Object} Base_
 * @property {Object} [data]
 * @property {random} [random]
 * @property {Boolean} [modified]
 * @property {Object} [variables]
 * @property {Date} [timestamp]
 */

export default class Base {
  constructor(data = {}) {
    /**
     * @type {Base_}
     * @private
     */
    this._ = {
      data,
      random,
      modified: false,
      variables: {},
      timestamp: new Date(),
    };
  }

  /**
   * @typedef {Object} _defineOptions
   * @property {Boolean} [save] Whether to include in the .toData function
   * @property {function} [get] The getter function for the property
   * @property {function} [set] The setter function for the property
   */

  /**
   * Defines a property of a getter and setter associated to a this._.variables variable
   * @param {String} key The property name to be defined on the class
   * @param {*} default The default value if there is none passed from the data in constructor
   * @param {_defineOptions} options Options to customize _defines process
   */
  _define(key, fallback, options = {}) {
    const {
      save = true,
      get = () => this._.variables[key].value,
      set = (v) => {
        if (this._.variables[key].value === v) return;
        this._.modified = true;
        this._.variables[key].value = v;
      },
    } = options;
    let value = this._.data[key];
    if (typeof value === 'undefined' || value === null) value = fallback;
    if (typeof value === 'function') value = value();
    this._.variables[key] = { key, value, save };
    Object.defineProperty(this, key, { get, set });
  }

  /**
   * Defines a '_id' property to the class
   */
  _defineID() {
    this._define('_id');
  }

  /**
   * Defines a reference to other modules
   * @param {String} key The name of the property
   * @param {Promise.<Base>} import The module that will be linked to
   */
  async _defineIDLink(key, importPromise) {
    this._define(`_${key}ID`);
    const get = async () => {
      const module = await importPromise;
      const Child = module.default;
      return Child.find({ _id: this[`_${key}ID`] });
    };
    Object.defineProperty(this, key, { get });
  }

  /**
   * Defines a 'reference' property to the class
   */
  _defineReference() {
    this._define('reference');
    if (typeof this.reference === 'undefined') this.reference = random.integer(0, 46656);
    if (typeof this.reference === 'number') this.reference = genReference(this.reference);
  }

  /**
   * Defines a 'insertedAt' property to the class
   */
  _defineTimestamp() {
    this._define('insertedAt');
    if (typeof this.insertedAt === 'undefined') this.insertedAt = new Date();
  }

  /**
   * Creates a savable/usable object that has no special getters or setters. just values
   * @returns {Object}
   */
  toData() {
    return Object.values(this._.variables)
      .filter(({ save }) => save)
      .reduce((previous, { key, value }) => {
        const copy = ({ ...previous });
        copy[key] = value;
        return copy;
      }, {});
  }

  /**
   * Creates a json string of base.toData()
   * @returns {String}
   */
  toJSON(...options) {
    return JSON.stringify(this.toData(), ...options);
  }

  /**
   * Creates the collection on the database
   * @param {String} collectionName
   * @returns {Promise.<import('mongodb').Collection>}
   */
  static async collection(collectionName) {
    return (await database()).collection(collectionName);
  }

  /**
   * @typedef {Object} newOptions
   * @property {Base} [link]
   */

  /**
   * Create and insert document into the database
   * @template Class
   * @param {Class} Class The class calling the function
   * @param {Object} options Default/loaded data
   * @param {newOptions} data The options for the new function
   * @returns {Class}
   */
  static async new(Class, options, data = {}) {
    const { links } = data;
    const item = new Class(options, links);
    return (await this.newBulk(Class, [item]))[0];
  }

  /**
   * Create a bulk amount of documents and inserts into the database
   * @template Class
   * @param {Class} Class The class calling the function
   * @param {Object[]} options The options for or instances of Class
   */
  static async newBulk(Class, options) {
    if (!Array.isArray(options)) return;
    if (options.length <= 0) return;
    const items = options
      .map((option) => (option instanceof Base ? option.toData() : new Class(option).toData()))
      .map((insertOne) => ({ insertOne }));
    (await Class.collection).bulkWrite(items);
  }

  /**
   * Find one document of the Class
   * @template Class
   * @param {Class} Class The class calling the function
   * @param {Object} query The search template
   * @returns {new() => Class}
   */
  static async findOne(Class, query = {}) {
    const item = await (await Class.collection).findOne(query);
    if (item === null) return undefined;
    return new Class(item);
  }

  /**
   * Find many documents of the Class
   * @template Class
   * @param {Class} Class The class calling the function
   * @param {*} query The search template
   * @returns {Class[]}
   */
  static async findMany(Class, query = {}) {
    return [...(await (await Class.collection)
      .find(query)
      .map((document) => new Class(document))
      .toArray()
    )];
  }

  /**
   * Update one document of the Class
   * @template Class
   * @param {Class} Class The class calling the function
   * @param {Class} item The document to update the cache and database
   */
  static async updateOne(Class, item) {
    if (!item._.modified) return;
    item._.modified = false;
  }
}
