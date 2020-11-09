import { AccountLogger } from '../../loggers';
import { Account } from '../../structures';
import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand({ account, discordUser }) {
  if (typeof account !== 'undefined') throw new Error('Account has already been registered');
  if (typeof discordUser !== 'undefined') {
    const newAccount = await Account.new({
      discordID: discordUser.id,
      discordUsername: discordUser.username,
    });
    return AccountLogger.newAccountCreationLog(newAccount).log();
  }
  throw new Error('Register failed to create account');
};

const command = new Command({
  id: 'register',
  title: 'Register',
  description: 'Registers yourself to the bot',
  aliases: ['register'],
  unregisteredAccess: true,
  registeredAccess: false,
  onExecute: execute,
});

export default command;
