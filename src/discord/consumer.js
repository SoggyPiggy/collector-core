import { DMChannel } from 'discord.js';
import { process } from '../commands';
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
  process(input, message)
    .then((...replyData) => send(...replyData))
    .catch((error) => send(error, 'reply', { message }));
};

client.on('message', processMessage);
