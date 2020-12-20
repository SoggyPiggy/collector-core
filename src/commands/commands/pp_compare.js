import Command from '../Command';
import CollectorError from '../../error';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new CollectorError('Command execute function not defined');
};

const command = new Command({
  id: 'pp_compare',
  title: 'PP Compare',
  description: 'Displays and compares two profiles\' stats',
  aliases: ['pp', 'ppcompare'],
  isPublic: false,
  onExecute: execute,
});

export default command;
