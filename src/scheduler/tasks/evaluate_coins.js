import scheduler from 'node-schedule';
import { Account, Coin, CoinInstance } from '../../structures';
import { evaluateCoin, evaluateCoinInstance } from '../../utils';

const getAll = async function getAllOfSomething(Class) {
  return [...(await (await Class.collection)
    .find({})
    .map((document) => new Class(document))
    .toArray())];
};

const evaluateCoins = async function evaluteAllCoinValues() {
  const accounts = await getAll(Account);
  const coinInstances = await getAll(CoinInstance);
  const coins = (await getAll(Coin));
  const coinsModified = coins
    .map((coin) => ({
      coin,
      accounts,
      instances: coinInstances.filter((instance) => coin._id.equals(instance._coinID)),
    }))
    .map((options) => ({
      ...options,
      coin: new Coin({
        ...options.coin,
        value: evaluateCoin(options.coin, accounts, options.instances),
      }),
    }))
    .map((options) => ({
      ...options,
      instances: options.instances
        .map((instance) => new CoinInstance({
          ...instance,
          value: evaluateCoinInstance(options.coin, instance),
        })),
    }))
    .filter(({ coin }, index) => coin.value !== coins[index].value);
  Coin.updateBulk(coinsModified.map(({ coin }) => coin));
  CoinInstance.updateBulk(coinsModified.map(({ instances }) => instances).flat());
};

scheduler.scheduleJob('coin_value_assessment', '* /30 * * * *', evaluateCoins);
