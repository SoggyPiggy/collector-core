/* eslint-disable no-param-reassign */
import { Account } from '../../structures';
import Command from '../Command';

/**
 * @param {import('../').CommandExecuteArgs} commandExecuteArgs
 */
const execute = async function executeCommand({ account }) {
  account.isAdminEnabled = !account.isAdminEnabled;
  Account.update(account);
  return `Admin override: ${account.isAdminEnabled ? 'Enabled' : 'Disabled'}`;
};

const command = new Command({
  id: 'admin_toggle',
  title: 'Admin Toggle',
  description: 'Toggles admin override',
  aliases: ['admin', 'admintoggle'],
  examples: ['admin_toggle'],
  isPublic: false,
  onExecute: execute,
});

export default command;
