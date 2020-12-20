import Command from '../Command';
import CollectorError from '../../error';
import { userResolver } from '../../utils';
import { Account } from '../../structures';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand({ account, command, inputArguments }) {
  const argv = command.parseArgs(inputArguments);
  const target = typeof argv._args[0] !== 'undefined' ? await userResolver(argv._args[0]) : account;
  if (!(target instanceof Account)) throw new CollectorError('Account not found');
  return target;
};

const command = new Command({
  id: 'profile',
  title: 'Profile',
  description: 'Displays the account stats of you or someone else',
  aliases: ['p', 'profile'],
  onExecute: execute,
});

export default command;
