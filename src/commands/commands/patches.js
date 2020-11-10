import Command from '../Command';
import { versions } from '../../changelog';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand({ inputArguments, command }) {
  const argv = command.parseArgs(inputArguments);
  const { previous, list } = argv;
  if (list) return [{ argv, embed: { title: 'Change Logs' } }, ...versions];
  return versions[previous];
};

const command = new Command({
  id: 'patches',
  title: 'Patch Notes',
  category: 'Utility',
  description: 'Displays the latest patch notes and changelog',
  aliases: ['patch', 'patchnotes'],
  arguments: [{
    names: ['previous', 'prev'],
    type: 'positiveInteger',
    default: 0,
    help: 'How many changelogs back ago',
  }, {
    names: ['list', 'l'],
    type: 'bool',
    default: false,
    help: 'Should display a list of patchnotes',
  }, {
    ...Command.pageArg,
    help: `If list is used, ${Command.pageArg.help.toLowerCase()}`,
  }],
  onExecute: execute,
});

export default command;
