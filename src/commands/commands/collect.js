import { CoinInstanceLogger } from '../../loggers';
import { Coin, CoinInstance } from '../../structures';
import Command from '../Command';

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const formatTime = function formatDateOrNumberIntoString(date) {
  let time = date instanceof Date ? date.getTime() : date;
  const days = Math.floor(time / day);
  time -= days * day;
  const hours = Math.floor(time / hour);
  time -= hours * hour;
  const minutes = Math.floor(time / minute);
  time -= minutes * minute;
  const seconds = Math.floor(time / second);
  return [
    [days, 'Day'],
    [hours, 'Hour'],
    [minutes, 'Minute'],
    [seconds, 'Second'],
  ]
    .filter(([count]) => count >= 1)
    .map(([count, title]) => (count === 1 ? `1 ${title}` : `${count} ${title}s`))
    .join(' ');
};

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand({ account }) {
  const log = await CoinInstanceLogger.getLastCollect(account);
  if (!(typeof log === 'undefined' || account.adminOverride)) {
    const { timestamp } = log;
    const now = Date.now();
    const currentDay = Math.floor(now / day);
    if (currentDay <= Math.floor(timestamp / day)) throw new Error(`You have already collected today\nReset happens in ${formatTime(((currentDay + 1) * day) - now)}`);
  }
  const coin = await Coin.randomCollectable();
  const coinInstance = await CoinInstance.new({}, account, coin);
  const instanceLog = await CoinInstanceLogger.newCollectLog(coinInstance, account);
  await instanceLog.log();
  return instanceLog;
};

const command = new Command({
  id: 'collect',
  title: 'Collect',
  description: 'Collect your daily coin',
  aliases: ['collect'],
  onExecute: execute,
});

export default command;
