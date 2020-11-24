import { promises as fs } from 'fs';
import xmldom from 'xmldom';

export const cache = new Map();

export const getXML = async function getXMLBufferFromMemoryOrDisk(file) {
  const data = cache.has(file) ? cache.get(file) : await fs.readFile(file, 'utf-8');
  cache.set(file, data);
  return new xmldom.DOMParser().parseFromString(data, 'text/xml');
};
