import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
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
