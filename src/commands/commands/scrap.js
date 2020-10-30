import Command from '../Command';

const execute = async function executeCommand() {
  throw new Error('Command execute function not defined');
};

const command = new Command({
  id: 'scrap',
  title: 'Scrap',
  description: 'Break down a coin into scrap',
  aliases: ['scr', 'scrap'],
  onExecute: execute,
});

export default command;
