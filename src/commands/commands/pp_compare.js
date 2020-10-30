import Command from '../Command';

const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'pp_compare',
  title: 'Pp,Compare',
  description: 'Displays and compares two profiles\' stats',
  aliases: ['pp', 'ppcompare'],
  onExecute: execute,
});

export default command;
