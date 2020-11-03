import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'coins',
  title: 'Coins',
  description: '',
  aliases: ['coins'],
  isPublic: false,
  onExecute: execute,
});

export default command;
