/**
 * @typedef {import('./Command').default} Command
 */

/* eslint-disable global-require */
/**
 * @type {Command[]}
 */
export const commandsAll = [
  require('./commands/help').default,
  require('./commands/register').default,
  require('./commands/guide').default,
  require('./commands/suggest').default,
  require('./commands/patches').default,
  require('./commands/collect').default,
  require('./commands/claim').default,
  require('./commands/profile').default,
  require('./commands/pp_compare').default,
  require('./commands/collection').default,
  require('./commands/coins').default,
  require('./commands/series').default,
  require('./commands/scrap').default,
  require('./commands/repair').default,
];
/* eslint-enable global-require */

export const commandsAdmin = commandsAll.filter((command) => command.registeredAccess);

export const commandsRegistered = commandsAll
  .filter((command) => command.isPublic && command.registeredAccess);

export const commandsUnregistered = commandsAll
  .filter((command) => command.isPublic && command.unregisteredAccess);

/**
 *
 * @param {Account|null} account
 */
export const getList = function getListOfAppropriateCommandsForAccount(account) {
  if (typeof account === 'undefined') return commandsUnregistered;
  if (account.isAdmin) return commandsAdmin;
  return commandsRegistered;
};

/**
 * Find a command from an alias
 * @param {string} alias The alias of the command being searched
 * @param {Command[]} commands The list of commands to search through, defaults to all commands
 */
export const findCommand = function findCommandBasedOnList(alias, commands = commandsAll) {
  return commands.find((command) => command.aliases.includes(alias));
};
