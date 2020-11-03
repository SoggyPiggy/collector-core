import Command from '../Command';
import { commandsAdmin, commandsRegistered, commandsUnregistered } from '..';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand({ account }) {
  if (typeof account === 'undefined') return commandsUnregistered;
  if (account.isAdmin) return commandsAdmin;
  return commandsRegistered;
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
