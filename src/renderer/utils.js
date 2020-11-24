import { join } from 'path';
import { CoinInstance } from '../structures';

export const artPath = join(process.cwd(), '/assets/coins/art');
export const mapPath = join(artPath, '../maps');

/* eslint-disable no-await-in-loop */
/**
 * @param {import('../structures').Coin|import('../structures').Series} item
 * @param {String} scope
 * @returns {Array}
 */
export const getStructure = async function getDirectoryStructureOfCoinOrSeries(item, scope) {
  let structure = [];
  let step = item instanceof CoinInstance ? (await item.coin) : item;
  while (step !== undefined) {
    structure.unshift(step);
    step = await step.series;
  }
  if (scope !== undefined) structure = structure.map((value) => value[scope]);
  return structure;
};
/* eslint-enable no-await-in-loop */