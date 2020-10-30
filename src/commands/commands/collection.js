import Command from '../Command';

const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'collection',
  title: 'Collection',
  description: 'Displays a users collection of coins',
  aliases: ['collection'],
  onExecute: execute,
});

export default command;
