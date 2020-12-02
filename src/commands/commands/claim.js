import Command from '../Command';
import { processClaim } from '../../claims';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand(commandExecuteArgs) {
  const { inputArguments } = commandExecuteArgs;
  const [code] = inputArguments;
  return processClaim(code, commandExecuteArgs);
};

const command = new Command({
  id: 'claim',
  title: 'Claim',
  description: 'Claim redeemable codes',
  aliases: ['claim'],
  examples: ['claim doomsday'],
  onExecute: execute,
});

export default command;
