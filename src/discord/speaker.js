import { MessageEmbed } from 'discord.js';
import client from './client';
import { Command } from '../commands';
import { AccountLogger, CoinInstanceLogger } from '../loggers';
import { MajorMinor } from '../changelog';
import {
  Account,
  CoinInstance,
  Suggestion,
} from '../structures';

/**
 * @param {Command} command
 */
const formatListCommand = function formatListCommand(command) {
  return `**${command.title}**: \`${command.aliases[0]}\` ${command.description}`;
};

/**
 * @param {MajorMinor} majorminor
 */
const formatListMajorMinor = function formatListMajorMinor(majorminor) {
  return `\`${majorminor.version}.X\` **${majorminor.name}** ${majorminor.patches.length}`;
};

/**
 * @param {Suggestion} suggestion
 */
const formatListSuggestion = function formatListSuggestion(suggestion) {
  const content = suggestion.content.length < 145 ? suggestion.content.length : `${suggestion.content.slice(0, 142)}...`;
  return `\`${suggestion.reference}\` ${content}`;
};

/**
 * @param {CoinInstance} coin
 */
const formatListCoinInstance = function formatListCoinInstance(coin) {
  return `\`${coin.reference}\`\`${coin}\``;
};

const resolveContentArrayItem = function resolveContentArrayItem(item) {
  switch (true) {
    case (typeof item === 'string'):
      return item;
    case (item instanceof Command):
      return formatListCommand(item);
    case (item instanceof MajorMinor):
      return formatListMajorMinor(item);
    case (item instanceof Suggestion):
      return formatListSuggestion(item);
    case (item instanceof CoinInstance):
      return formatListCoinInstance(item);
    default:
      return 'Could not resolve list item';
  }
};

const resolveContentArray = function resolveContentArray(content) {
  const [{ argv, embed: embedOptions }, ...items] = content;
  const embed = new MessageEmbed({ ...embedOptions });
  const maxPage = Math.ceil(items.length / 20);
  const page = Math.min(argv.page, maxPage);
  const pageItems = items.slice((page - 1) * 20, page * 20);
  embed.setDescription(pageItems.map(resolveContentArrayItem));
  embed.setFooter(`Page ${page} of ${maxPage}`);
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
    command.aliases.length <= 0 ? '' : `\n**Aliases**\n\`${command.aliases.join('`, `')}\``,
    command.arguments.length <= 0 ? '' : `\n**Arguments**\n${
      command.arguments.map((argument) => `\`${
        argument.names
          .map((argAlias) => (argAlias.length > 1 ? `--${argAlias}` : `-${argAlias}`))
          .join('`, `')}\`\n${argument.help}`).join('\n')
    }`,
    command.examples.length <= 0 ? '' : `\n**Examples**\n${command.examples.join('\n')}`,
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

const formatAccount = async function formatAccount(account) {
  const user = client.users.fetch(account.discordID);
  const embed = new MessageEmbed();
  embed.setTitle(`Profile: ${(await user).username}`);
  embed.setThumbnail((await user).avatarURL({ format: 'png', dynamic: true, size: 128 }));
  embed.setDescription([
    `**Collection**: ${undefined}`,
    `**Collection Unique**: ${undefined}`,
    `**Collection Value**: ${undefined}`,
    `**Collection Avg Value**: ${undefined}`,
    `**Collection MVC**: ${undefined}`,
    `**Collection LVC**: ${undefined}`,
    '',
    `**Coins Collected**: ${undefined}`,
    `**Coins Scrapped**: ${undefined}`,
    '',
    `**Scrap**: ${undefined}`,
    `**Scrap Collected**: ${undefined}`,
    `**Scrap Used**: ${undefined}`,
  ].join('\n'));
};

const formatMajorMinor = function formatMajorMinor(minor) {
  const embed = new MessageEmbed();
  embed.setTitle(`${minor.name}`);
  embed.addFields(minor.patches.map((patch) => ({
    name: `\`${minor.version}.${patch.version}\``,
    value: patch.notes.map(([noteTitle, notes]) => [
      `**${noteTitle}**`,
      ...notes.map((note) => ` - ${note}`),
    ].join('\n')),
  })));
  return embed;
};

/**
 * @param {Suggestion} suggestion
 */
const formatSuggestion = function formatSuggestion(suggestion) {
  const content = suggestion.content.length > 255
    ? `${suggestion.content.slice(0, 252)}...` : suggestion.content;
  const embed = new MessageEmbed();
  embed.setDescription(content);
  embed.setFooter(suggestion.reference);
  return embed;
};

/**
 * @param {CoinInstance} coin
 */
const formatCoinInstance = async function formatCoinInstance(coin) {
  const base = await coin.coin;
  const embed = new MessageEmbed();
  embed.setTitle(base.name);
  embed.setAuthor((await (await base.series).structure('name')).join(' > '));
  embed.setImage(coin.renderURL());
  embed.setFooter(coin.reference);
  embed.setDescription(`
  **Grade**: ${coin.grade}
  **Value**: ${coin.friendlyValue()}
  `);
  return embed;
};

const formatCoinInstanceLogCollect = async function formatCoinInstanceLogCollect(log) {
  const coin = await log.coinInstance;
  if (typeof coin === 'undefined') return 'uhh... oops';
  return formatCoinInstance(coin);
};

const resolveContent = async function resolveContent(content) {
  switch (true) {
    case (typeof content === 'string'):
    case (content instanceof MessageEmbed):
      return content;
    case (Array.isArray(content)):
      return resolveContentArray(content);
    case (content instanceof Command):
      return formatCommand(content);
    case (content instanceof Account):
      return formatAccount(content);
    case (content instanceof MajorMinor):
      return formatMajorMinor(content);
    case (content instanceof AccountLogger && content.transaction === 'account-created'):
      return formatAccountCreated(content);
    case (content instanceof Suggestion):
      return formatSuggestion(content);
    case (content instanceof CoinInstance):
      return formatCoinInstance(content);
    case (content instanceof CoinInstanceLogger):
      switch (content.transaction) {
        case 'collected':
          return formatCoinInstanceLogCollect(content);
        default:
          return 'Could not resolve CoinInstanceLogger';
      }
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
