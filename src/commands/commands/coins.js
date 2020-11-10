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
  description: 'Displays a list of coins, or information about a coin',
  aliases: ['c', 'coins'],
  isPublic: false,
  onExecute: execute,
});

export default command;
