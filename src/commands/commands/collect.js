import Command from '../Command';

const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'collect',
  title: 'Collect',
  description: 'Collect your daily coin. Resets at 8pm EST',
  aliases: ['collect'],
  onExecute: execute,
});

export default command;
