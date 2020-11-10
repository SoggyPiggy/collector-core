import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'collect',
  title: 'Collect',
  description: 'Collect your daily coin',
  aliases: ['collect'],
  onExecute: execute,
});

export default command;
