/* eslint-disable no-param-reassign */
import { ObjectID } from 'mongodb';
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

export default class Base {
  constructor(data = {}) {
    this._ = {
      data,
      random,
      modified: false,
      variables: {},
      timestamp: new Date(),
    };
  }

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

  _defineID() {
    this._define('_id');
  }

  async _defineIDLink(key, importPromise) {
    this._define(`_${key}ID`);
    const get = async () => {
      const module = await importPromise;
      const Child = module.default;
      return Child.find({ _id: this[`_${key}ID`] });
    };
    Object.defineProperty(this, key, { get });
  }

  _defineReference() {
    this._define('reference');
    if (typeof this.reference === 'undefined') this.reference = random.integer(0, 46656);
    if (typeof this.reference === 'number') this.reference = genReference(this.reference);
  }

  _defineTimestamp() {
    this._define('insertedAt');
    if (typeof this.insertedAt === 'undefined') this.insertedAt = new Date();
  }

  toData() {
    return Object.values(this._.variables)
      .filter(({ save }) => save)
      .reduce((previous, { key, value }) => {
        const copy = ({ ...previous });
        copy[key] = value;
        return copy;
      }, {});
  }

  toJSON(...options) {
    return JSON.stringify(this.toData(), ...options);
  }

  static async collection(collectionName) {
    return (await database()).collection(collectionName);
  }

  static async new(Class, options, data = {}) {
    const { links } = data;
    const item = new Class(options, links);
    return (await this.newBulk(Class, [item]))[0];
  }

  static async newBulk(Class, options) {
    if (!Array.isArray(options)) return;
    if (options.length <= 0) return;
    const items = options
      .map((option) => (option instanceof Base ? option.toData() : option))
      .map((insertOne) => ({ insertOne }));
    (await Class.collection).bulkWrite(items);
  }

  static async findOne(Class, query = {}) {
    const item = await (await Class.collection).findOne(query);
    if (item === null) return undefined;
    return new Class(item);
  }

  static async updateOne(item) {
    if (!item._.modified) return;
    item._.modified = false;
  }
}
