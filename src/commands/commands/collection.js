import Command from '../Command';
import userResolver from '../../utils/userResolver';
import { CoinInstance } from '../../structures';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand({ account, command, inputArguments }) {
  const argv = command.parseArgs(inputArguments);
  const target = typeof argv._args[0] !== 'undefined' ? await userResolver(argv._args[0]) : account;
  const coins = await CoinInstance.sort(await CoinInstance.allFromAccount(target));
  return [{ argv, embed: { title: `${target.discordUsername}'s Collection` } }, ...coins];
};

const command = new Command({
  id: 'collection',
  title: 'Collection',
  description: 'Displays a users collection of coins',
  aliases: ['col', 'collection'],
  arguments: [Command.pageArg],
  onExecute: execute,
});

export default command;
