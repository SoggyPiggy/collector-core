import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'pp_compare',
  title: 'PP Compare',
  description: 'Displays and compares two profiles\' stats',
  aliases: ['pp', 'ppcompare'],
  onExecute: execute,
});

export default command;
