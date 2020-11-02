import { database } from '../database';
import random from '../utils/random';

export const dbCollection = async function getDatabaseCollectionCoin() {
  return (await database()).collection('coinInstances');
};

export const generateConditionRoll = function generateCoinInstanceCoditionRoll() {
  return random.real(0, 1, true);
};

export const processConditionRoll = function processCoinInstanceConditionRoll(roll) {
  if (roll === 0 || roll === 1) return roll;
  if (roll < 0.5) return 1 - processConditionRoll(1 - roll);
  return (((2 * roll - 1) ** 2.2) / 2) + 0.5;
};

export default class Coin {
  constructor(options = {}) {
    this._id = undefined;
    this._coinID = undefined;
    this.conditionRoll = generateConditionRoll();
    this.condition = processConditionRoll(this.conditionRoll);
    this.conditionNatural = this.condition;
    this.value = 0;
    this.isAltered = false;
    this.insertedAt = new Date();
    Object.assign(this, options);
  }

  static get collection() { return dbCollection(); }
}
