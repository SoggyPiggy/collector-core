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
  constructor({
    _id,
    coinID,
    conditionRoll = generateConditionRoll,
    condition = processConditionRoll,
    conditionNatural,
    value = 0,
    isAltered = false,
  }) {
    const generatedRoll = typeof conditionRoll === 'function' ? conditionRoll() : conditionRoll;
    const generatedCondition = typeof condition === 'function' ? condition(generatedRoll) : condition;

    this._id = _id;
    this.coinID = coinID;
    this.condition = generatedCondition;
    this.conditionRoll = generatedRoll;
    this.conditionNatural = typeof conditionNatural === 'undefined' ? generatedCondition : conditionNatural;
    this.value = value;
    this.isAltered = isAltered;
  }

  static get collection() { return dbCollection(); }
}
