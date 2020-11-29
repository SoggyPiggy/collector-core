import Command from '../Command';
import CollectorError from '../../error';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new CollectorError('Command execute function not defined');
};

const command = new Command({
  id: 'coins',
  title: 'Coins',
  description: 'Displays a list of coins, or information about a coin',
  aliases: ['c', 'coins'],
  isPublic: false,
  onExecute: execute,
});

export default command;
