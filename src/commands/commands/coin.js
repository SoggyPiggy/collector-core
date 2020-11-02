import Command from '../Command';

const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'coin',
  title: 'Coin',
  description: '',
  aliases: ['coin'],
  isPublic: false,
  onExecute: execute,
});

export default command;