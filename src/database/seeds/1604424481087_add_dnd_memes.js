import { Coin, Series } from '../../structures';

export default {
  version: 1604424481087,
  async run() {
    const seriesDND = await Series.new({
      name: 'Dungeons & Dragons',
      directory: 'dnd',
    });

    const seriesDNDMemes = await Series.new({
      name: 'Memes',
      directory: 'memes_01',
    }, seriesDND);

    await Coin.newBulk([{
      name: 'Creepo the Depraved',
      directory: 'creepo',
      flavorText: 'Hmm... Smells like 8 or 9',
    }, {
      name: 'Meepo Slain',
      directory: 'meepo',
    }, {
      name: 'Vat Baby',
      directory: 'vat_baby',
    }, {
      name: 'Bulkamania',
      directory: '',
      flavorText: 'God created the Heavens, he created the earth! Then, he created a set of 24-inch pythons, brother!',
    }, {
      name: 'I sit on him',
    }, {
      name: 'DM Rage Quit',
    }, {
      name: 'Railroad',
    }], seriesDNDMemes);
  },
};
