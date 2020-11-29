import Command from '../Command';
import { Suggestion } from '../../structures';
import CollectorError from '../../error';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand({ account, inputArguments }) {
  const content = inputArguments.join(' ');
  if (content.length <= 0) throw new CollectorError('No suggestion was given');
  const suggestion = await Suggestion.new(account, content);
  return suggestion;
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
