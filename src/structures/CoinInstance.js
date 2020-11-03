import { database } from '../database';
import random from '../utils/random';

const collection = (async () => (await database()).collection('coin_instances'))();

export const generateConditionRoll = function generateCoinInstanceCoditionRoll() {
  return random.real(0, 1, true);
};

export const processConditionRoll = function processCoinInstanceConditionRoll(roll) {
  if (roll === 0 || roll === 1) return roll;
  if (roll < 0.5) return 1 - processConditionRoll(1 - roll);
  return (((2 * roll - 1) ** 2.2) / 2) + 0.5;
};

export default class CoinInstance {
  constructor(options = {}) {
    this._id = undefined;
    this._coinID = undefined;
    this._accountID = undefined;
    this.conditionRoll = generateConditionRoll();
    this.condition = processConditionRoll(this.conditionRoll);
    this.conditionNatural = this.condition;
    this.value = 0;
    this.isAltered = false;
    this.insertedAt = new Date();
    Object.assign(this, options);
  }

  static get collection() { return collection; }
}
