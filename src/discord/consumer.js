import { DMChannel } from 'discord.js';
import { process } from '../commands';
import { Account } from '../structures';
import client from './client';
import { send } from './speaker';

/**
 * @typedef {import('discord.js').Message} Message
 */

/**
 * Checks if message is a valid command and sends it to the commands module if it is.
 * @param {Message} message
 */
const processMessage = async function processMessageFromClientEvent(message) {
  const { author, channel, content } = message;
  if (author.bot) return;
  if (!(channel instanceof DMChannel || content.startsWith('>'))) return;
  const input = content.toLowerCase().replace(/^>/g, '');
  const account = await Account.find({ discordID: author.id });
  process(input, account, { discordUser: author })
    .then((result) => send(result, author, channel))
    .catch((error) => send(error.message, author, channel));
};

client.on('message', processMessage);
