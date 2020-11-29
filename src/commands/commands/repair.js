import Command from '../Command';
import CollectorError from '../../error';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new CollectorError('Command execute function not defined');
};

const command = new Command({
  id: 'repair',
  title: 'Repair',
  description: 'Use scrap to improve a coins condition and value',
  aliases: ['rpr', 'repair'],
  onExecute: execute,
});

export default command;
