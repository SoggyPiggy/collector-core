import { MessageEmbed } from 'discord.js';
import { Command } from '../commands';
import {
} from '../structures';

/**
 * @param {Command} command
 */
const formatListCommand = function formatListCommand(command) {
  return `**${command.title}**: \`${command.aliases[0]}\` ${command.description}`;
};

const resolveContentArrayItem = function resolveContentArrayItem(item) {
  switch (true) {
    case (typeof item === 'string'):
      return item;
    case (item instanceof Command):
      return formatListCommand(item);
    default:
      return 'Could not resolve list item';
  }
};

const resolveContentArray = function resolveContentArray(content) {
  const [options, ...items] = content;
  const embed = new MessageEmbed({ ...options });
  embed.setDescription(items.map(resolveContentArrayItem));
  return embed;
};

/**
 * @param {Command} command
 */
const formatCommand = function formatCommand(command) {
  const embed = new MessageEmbed();
  embed.setTitle(`Help Menu: ${command.title}`);
  embed.setDescription([
    command.description,
    `\n**Aliases**\n\`${command.aliases.join('`, `')}\``,
    // TODO: Add command.arguments here
    `\n**Examples**\n${command.examples.join('\n')}`,
  ].filter((section) => section !== '').join('\n'));
  return embed;
};

const resolveContent = function resolveContent(content) {
  switch (true) {
    case (typeof content === 'string'):
    case (content instanceof MessageEmbed):
      return content;
    case (Array.isArray(content)):
      return resolveContentArray(content);
    case (content instanceof Command):
      return formatCommand(content);
    default:
      return 'Could not resolve item';
  }
};

export const send = function sendMessage(content, destination) {
  const message = resolveContent(content);
  destination.send(message);
};

export const notify = function sendNotification() {};
