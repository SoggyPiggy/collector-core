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
 * @property {import('../structures').Account | undefined} [account]
 * @property {Command} [command]
 * @property {string} [input]
 * @property {string} [inputCommand]
 * @property {string[]} [inputArguments]
 * @property {import('discord.js').Message | undefined} [discordMessage]
 * @property {import('discord.js').User | undefined} [discordUser]
 */
