import sharp from 'sharp';
import xmldom from 'xmldom';
import { join } from 'path';
import { promises as fs } from 'fs';
import { artPath, mapPath } from './utils';

const xmlCache = new Map();
const timeouts = new Map();

/**
 * @param {import('mongodb').ObjectID} _id
 * @param {Map} map
 */
const resetTimer = function setResetTimerOnMap(_id, map, time) {
  if (timeouts.has(_id)) clearTimeout(timeouts.get(_id));
  timeouts.set(_id, setTimeout(() => {
    map.delete(_id);
    timeouts.delete(_id);
  }, time));
};

const map = sharp(`${join(mapPath, 'standard_01.png')}`);

export default class RendererCache {
  static async getXML(coin) {
    const { _id } = coin;
    let data;
    if (xmlCache.has(_id)) data = xmlCache.get(_id);
    else {
      const base = await coin.coin;
      const directories = [...(await base.structure('directory')), base.directory];
      data = await fs.readFile(`${join(artPath, ...directories)}.svg`, 'utf-8');
      xmlCache.set(_id, data);
      resetTimer(_id, xmlCache, 60000 * 10);
    }
    return new xmldom.DOMParser().parseFromString(data, 'text/xml');
  }

  static async getMap() {
    return (await map).clone();
  }
}
