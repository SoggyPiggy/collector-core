import Command from '../Command';
import { commandsAdmin, commandsRegistered, commandsUnregistered } from '..';
import { findCommand } from '../organiser';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand({ account, inputArguments, command }) {
  const argv = command.parseArgs(inputArguments);
  const [argCommand] = argv._args;
  let commands;
  if (typeof account === 'undefined') commands = commandsUnregistered;
  else if (account.isAdmin) commands = commandsAdmin;
  else commands = commandsRegistered;
  const foundCommand = findCommand(argCommand, commands);
  if (foundCommand instanceof Command) return foundCommand;
  return [{ argv, embed: { title: 'Help Menu' } }, ...commands];
};

const command = new Command({
  id: 'help',
  title: 'Help',
  category: 'Utility',
  description: 'Displays a list of commands, or information about a command',
  aliases: ['h', 'help'],
  examples: ['help', 'h collect', 'h h'],
  arguments: [Command.pageArg],
  unregisteredAccess: true,
  onExecute: execute,
});

export default command;
