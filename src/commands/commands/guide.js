import Command from '../Command';
import CollectorError from '../../error';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new CollectorError('Command execute function not defined');
};

const command = new Command({
  id: 'guide',
  title: 'Guide',
  category: 'Utility',
  description: 'Useful information about the bot',
  aliases: ['guide'],
  onExecute: execute,
});

export default command;
