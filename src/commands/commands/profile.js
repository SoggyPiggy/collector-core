import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'profile',
  title: 'Profile',
  description: 'Displays the account stats of you or someone else',
  aliases: ['p', 'profile'],
  onExecute: execute,
});

export default command;
