import { Coin, CoinInstance } from '../../structures';
import { ClaimLogger } from '../../loggers';

export const hash = '828a871294bf08124b4abbb646cd04f10d65a1bfd7621c16a54b62365d7b75d0';

/**
 * @param {import('../../commands').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeClaimFunction({ account }) {
  const coins = await Promise.all(Array(2).fill(null).map(() => Coin.randomCollectable()));
  const coinInstances = await CoinInstance.insertBulk(
    coins.map((coin) => CoinInstance.generate({}, account, coin)),
  );
  ClaimLogger.newClaim(hash, account, `${account.discordUsername} Doomsday claimed`).log();
  return [{ embed: { title: 'Code Claimed' } }, ...coinInstances];
};
export default execute;
