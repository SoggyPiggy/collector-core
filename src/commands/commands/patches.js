import Command from '../Command';
import { getLatest } from '../../changelog';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  return getLatest();
};

const command = new Command({
  id: 'patches',
  title: 'Patches',
  category: 'Utility',
  description: 'Displays the latest patch notes and changelog',
  aliases: ['patch', 'patchnotes'],
  onExecute: execute,
});

export default command;
