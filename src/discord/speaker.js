import { MessageEmbed } from 'discord.js';
import { Command } from '../commands';
import { AccountLogger } from '../loggers';
import { Account } from '../structures';

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

const formatAccountCreated = async function formatAccountCreated(logger) {
  const account = await Account.find({ _id: logger._accountID });
  const embed = new MessageEmbed();
  embed.setTitle('Account Created');
  embed.setDescription(`${account.discordUsername || 'New account'} has been registered`);
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
    case (content instanceof AccountLogger && content.transaction === 'account-created'):
      return formatAccountCreated(content);
    default:
      return 'Could not resolve item';
  }
};

/**
 * @param {*} message
 * @param {import('discord.js').User} user
 */
const appendUser = function appendUserToMessage(message, user) {
  if (typeof message === 'string') return `${user}, ${message}`;
  if (message instanceof MessageEmbed) return { content: `${user}`, embed: message };
  return message;
};

export const send = async function sendMessage(content, user, destination) {
  const message = await resolveContent(content);
  destination.send(appendUser(message, user));
};

export const notify = function sendNotification() {};
