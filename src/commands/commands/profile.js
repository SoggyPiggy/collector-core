import Command from '../Command';

const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'profile',
  title: 'Profile',
  description: 'Displays stats of a user',
  aliases: ['p', 'profile'],
  onExecute: execute,
});

export default command;
