import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'register',
  title: 'Register',
  description: 'Registers yourself to the bot',
  aliases: ['register'],
  unregisteredAccess: true,
  onExecute: execute,
});

export default command;
