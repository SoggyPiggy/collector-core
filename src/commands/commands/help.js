import Command from '../Command';
import { commandsAdmin, commandsRegistered, commandsUnregistered } from '..';
import { findCommand } from '../organiser';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand({ account, inputArguments }) {
  const [argCommand] = inputArguments;
  let commands;
  if (typeof account === 'undefined') commands = commandsUnregistered;
  else if (account.isAdmin) commands = commandsAdmin;
  else commands = commandsRegistered;
  const command = findCommand(argCommand, commands);
  if (command instanceof Command) return command;
  return [{ title: 'Help Menu' }, ...commands];
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
