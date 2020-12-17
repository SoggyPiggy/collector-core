import scheduler from 'node-schedule';
import { Account, Coin, CoinInstance } from '../../structures';

const getAll = async function getAllOfSomething(Class) {
  return [...(await (await Account.collection)
    .find({})
    .map((document) => new Class(document))
    .toArray())];
};

const evaluateCoin = function evaluteCoinValue(coin, { accounts, coinInstances }) {
  const instances = coinInstances.filter((coinInstance) => coin._id.equal(coinInstance._coinID));
  const owners = [...new Set([
    ...instances.map(({ _accountID }) => _accountID),
  ]).values()];
  let value = ((1000 / coin.weight) ** 3) * 5;
  if (accounts.length !== owners.length) {
    value *= (0.5 * ((owners.length - 1) / accounts.length)) + 0.5;
  }
  if (!coin.inCirculation) value *= 1.2;
  if (coin.isRetired) value *= 1.2;
  if (coin.isError) value *= 1.8;
  return new Coin({ ...coin, value });
};

const evaluateCoins = async function evaluteAllCoinValues() {
  const accounts = await getAll(Account);
  const coinInstances = await getAll(CoinInstance);
  const coins = await getAll(Coin);
  Promise.all(coins.map((coin) => evaluateCoin(coin, { accounts, coinInstances })))
    .then(Coin.updateBulk);
};

scheduler.scheduleJob('coin_value_assessment', '* /30 * * * *', evaluateCoins);
