import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'suggest',
  title: 'Suggest',
  category: 'Utility',
  description: 'Make any suggestion for the bot',
  aliases: ['suggest'],
  examples: ['suggest There should be coins of pickles'],
  onExecute: execute,
});

export default command;
