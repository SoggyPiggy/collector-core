import { Coin, Series } from '../../structures';

export default {
  version: 1605030483788,
  async run() {
    const seriesMusic = await Series.find({ name: 'Music', directory: 'music' });
    const seriesMusicArtist1 = await Series.find({
      _seriesID: seriesMusic._id,
      name: 'Artist',
    });
    const seriesMusicArtist2 = await Series.find({
      _seriesID: seriesMusic._id,
      name: 'Artist: 2',
    });
    await (await Coin.collection).updateMany(
      { _seriesID: seriesMusicArtist1._id },
      { $set: { inCirculation: false, isRetired: true } },
    );
    await (await Coin.collection).updateMany(
      { _seriesID: seriesMusicArtist2._id },
      { $set: { inCirculation: false, isRetired: true } },
    );
  },
};
