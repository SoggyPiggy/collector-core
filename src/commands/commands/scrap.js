import Command from '../Command';
import CollectorError from '../../error';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new CollectorError('Command execute function not defined');
};

const command = new Command({
  id: 'scrap',
  title: 'Scrap',
  description: 'Break down a coin into scrap',
  aliases: ['scr', 'scrap'],
  onExecute: execute,
});

export default command;
