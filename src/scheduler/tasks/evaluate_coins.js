import scheduler from 'node-schedule';
import { Account, Coin, CoinInstance } from '../../structures';

const getAll = async function getAllOfSomething(Class) {
  return [...(await (await Class.collection)
    .find({})
    .map((document) => new Class(document))
    .toArray())];
};

const evaluateInstance = function evaluteCoinInstanceValue(options = {}) {
  const { coin, instances } = options;
  return {
    ...options,
    instances: instances.map((instance) => {
      let { value } = coin;
      if (instance.condition === 0) value *= 0.5;
      else value *= (0.9 * instance.condition) + 0.1;
      if (instance.isAltered) value *= 0.8;
      return new CoinInstance({ ...instance, value });
    }),
  };
};

const evaluateCoin = function evaluteCoinValue(options = {}) {
  const { coin, accounts, instances } = options;
  const owners = [...new Set(instances.map(({ _accountID }) => _accountID)).values()].length;
  let value = ((1000 / coin.weight) ** 3) * 5;
  if (accounts.length !== owners) value *= (0.5 * ((owners - 1) / accounts.length)) + 0.5;
  if (!coin.inCirculation) value *= 1.2;
  if (coin.isRetired) value *= 1.2;
  if (coin.isError) value *= 1.8;
  return {
    ...options,
    coin: new Coin({ ...coin, value }),
  };
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
    .map(evaluateCoin)
    .map(evaluateInstance)
    .filter(({ coin }, index) => coin.value !== coins[index].value);
  Coin.updateBulk(coinsModified.map(({ coin }) => coin));
  CoinInstance.updateBulk(coinsModified.map(({ instances }) => instances).flat());
};

scheduler.scheduleJob('coin_value_assessment', '* /30 * * * *', evaluateCoins);
