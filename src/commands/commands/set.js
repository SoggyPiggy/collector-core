import Command from '../Command';

const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'set',
  title: 'Set',
  description: 'Displays details of a set',
  aliases: ['set'],
  onExecute: execute,
});

export default command;
