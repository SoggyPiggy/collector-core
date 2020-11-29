import Command from '../Command';
import CollectorError from '../../error';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new CollectorError('Command execute function not defined');
};

const command = new Command({
  id: 'series',
  title: 'Series',
  description: 'Displays a list of series, or information about a series',
  aliases: ['s', 'series'],
  examples: ['series'],
  onExecute: execute,
});

export default command;
