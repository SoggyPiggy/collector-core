import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'repair',
  title: 'Repair',
  description: 'Use scrap to improve a coins condition and value',
  aliases: ['rpr', 'repair'],
  onExecute: execute,
});

export default command;
