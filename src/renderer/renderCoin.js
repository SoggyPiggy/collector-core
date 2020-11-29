import sharp from 'sharp';
import xmldom from 'xmldom';
import RendererCache from './RendererCache';
import CollectorError from '../error';

/**
 * @param {import('../structures').Coin} coin
 */
export default async function renderCoin(coin, { size = 256 }) {
  const xml = await RendererCache.getXML(coin);
  const xmlSVGs = xml.getElementsByTagName('svg');
  if (xmlSVGs.length <= 0) throw new CollectorError('No SVGs found in file');
  const xmlMainSVG = xmlSVGs.item(0);
  xmlMainSVG.setAttribute('width', `${size}px`);
  xmlMainSVG.setAttribute('height', `${size}px`);
  return sharp(Buffer.from(new xmldom.XMLSerializer().serializeToString(xml))).png().toBuffer();
}
