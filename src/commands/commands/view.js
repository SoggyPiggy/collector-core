import Command from '../Command';

const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'view',
  title: 'View Coin',
  description: 'Displays a coin you own',
  aliases: ['v', 'view', 'viewcoin'],
  examples: ['view 00I6', 'v i6'],
  onExecute: execute,
});

export default command;
