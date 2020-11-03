import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'sets',
  title: 'Sets',
  description: 'Displays a list of sets',
  aliases: ['sets'],
  onExecute: execute,
});

export default command;
