import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
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
