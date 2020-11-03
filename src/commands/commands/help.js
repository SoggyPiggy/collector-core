import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'help',
  title: 'Help',
  category: 'Utility',
  description: 'Displays a list of commands, or information about a command',
  aliases: ['h', 'help'],
  unregisteredAccess: true,
  onExecute: execute,
});

export default command;
