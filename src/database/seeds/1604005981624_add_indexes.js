import { CoinInstance, Suggestion } from '../../structures';

export default {
  version: 1604005981624,
  async run() {
    await (await CoinInstance.collection).createIndex('reference', { unique: true });
    await (await Suggestion.collection).createIndex('reference', { unique: true });
  },
};
