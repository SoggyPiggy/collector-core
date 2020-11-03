import Command from './Command';
import { process } from './process';
import {
  findCommand,
  commandsAll,
  commandsAdmin,
  commandsRegistered,
  commandsUnregistered,
} from './organiser';

export {
  Command,
  process,
  findCommand,
  commandsAll,
  commandsAdmin,
  commandsRegistered,
  commandsUnregistered,
};

/**
 * @typedef {Object} CommandExecuteArgs
 * @property {import('../structures').Account} [account]
 * @property {string} [input]
 * @property {string} [inputCommand]
 * @property {string[]} [inputArguments]
 */
