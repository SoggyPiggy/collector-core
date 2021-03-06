import Command from '../Command';
import { CoinInstance } from '../../structures';
import CollectorError from '../../error';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand({ account, inputArguments, command }) {
  const argv = command.parseArgs(inputArguments);
  if (argv._args.length <= 0) throw new CollectorError('Coin reference not provided');
  const [argCoinReference] = argv._args;
  const coin = await CoinInstance.getByReference(argCoinReference);
  if (typeof coin === 'undefined') throw new CollectorError(`Coin not found: ${argCoinReference}`);
  if (!coin._accountID.equals(account._id)) throw new CollectorError(`Coin not in possession: ${coin.reference}`);
  return coin;
};

const command = new Command({
  id: 'view',
  title: 'View Coin',
  description: 'Displays a coin you own',
  aliases: ['v', 'view', 'viewcoin'],
  examples: ['view 00I6', 'v i6'],
  onExecute: execute,
});

export default command;
