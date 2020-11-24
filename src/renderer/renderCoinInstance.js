import sharp from 'sharp';
import xmldom from 'xmldom';
import RendererCache from './RendererCache';

/**
 * @param {import('../structures').CoinInstance} coin
 */
export default async function renderCoinInstance(coin, { size = 256 }) {
  const xml = await RendererCache.getXML(coin);
  const xmlSVGs = xml.getElementsByTagName('svg');
  if (xmlSVGs.length <= 0) throw new Error('No SVGs found in file');
  const xmlMainSVG = xmlSVGs.item(0);
  xmlMainSVG.setAttribute('width', `${size}px`);
  xmlMainSVG.setAttribute('height', `${size}px`);
  const art = sharp(Buffer.from(new xmldom.XMLSerializer().serializeToString(xml)));
  xml.getElementById('core').setAttribute('display', 'none');
  xml.getElementById('outline').setAttribute('display', 'none');
  xml.getElementsByTagName('g').item(0).setAttribute('display', 'none');
  const back = sharp(Buffer.from(new xmldom.XMLSerializer().serializeToString(xml)));
  const map = (await RendererCache.getMap())
    .threshold(255 - Math.floor(255 * coin.condition))
    .blur(0.8)
    .resize(size)
    .composite([{
      input: await art.clone().extractChannel('alpha').toColorspace('b-w').toBuffer(),
      blend: 'multiply',
    }])
    .removeAlpha();

  return sharp(await back.toBuffer())
    .composite([{
      input: await sharp(
        (await art.clone().extractChannel('red').toColorspace('b-w').raw()
          .toBuffer({ resolveWithObject: true })).data,
        { raw: { width: size, height: size, channels: 1 } },
      ).joinChannel([
        (await art.clone().extractChannel('green').toColorspace('b-w').raw()
          .toBuffer({ resolveWithObject: true })).data,
        (await art.clone().extractChannel('blue').toColorspace('b-w').raw()
          .toBuffer({ resolveWithObject: true })).data,
        (await map.clone().toColorspace('b-w').raw()
          .toBuffer({ resolveWithObject: true })).data,
      ], { raw: { width: size, height: size, channels: 1 } }).png().toBuffer(),
    }])
    .png()
    .toBuffer();
}
