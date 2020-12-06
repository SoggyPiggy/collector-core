const reactiveCache = new Map();
const timeoutCache = new Map();

const resetRemoval = function setOrResetRemovalOfReactives(id) {
  const old = timeoutCache.get(id);
  if (old) {
    clearTimeout(old);
    timeoutCache.delete(id);
  }
  const timeout = setTimeout(() => {
    reactiveCache.delete(id);
  }, 1800000);
  timeoutCache.set(id, timeout);
};

/**
 * @param {function} resolver
 * @param {Promise<import('discord.js').Message>} message
 * @param {*} content
 */
export const makeReactive = async function makeMessageReactive(resolver, message, content, user) {
  if (!Array.isArray(content)) return;
  resetRemoval((await message).id);
  reactiveCache.set((await message).id, {
    resolver,
    content,
    user,
  });
  (await message).react('⬅️');
  (await message).react('➡️');
};

/**
 * @param {import('discord.js').MessageReaction} reactionMessage
 * @param {import('discord.js').User} reactionUser
 */
export const processReaction = async function processReactionForReactives(
  reactionMessage,
  reactionUser,
) {
  const { message, emoji } = reactionMessage;
  if (!reactiveCache.has(message.id)) return;
  const { resolver, content, user } = reactiveCache.get(message.id);
  if (reactionUser.id !== user.id) return;
  resetRemoval(message.id);
  const [options, ...items] = content;
  const { argv = {} } = options;
  let { page = 1 } = argv;
  if (emoji.name === '⬅️') page -= 1;
  if (emoji.name === '➡️') page += 1;
  page = Math.max(1, Math.min(page, Math.ceil(items.length / 20)));
  const newContent = [{ ...options, argv: { ...argv, page } }, ...items];
  const newResolvedContent = await resolver(newContent);
  reactiveCache.set(message.id, {
    resolver,
    content: newContent,
    user,
  });
  if (page !== argv.page) message.edit(newResolvedContent);
};

export const removeAll = function removeAllReactivesAndReactions() {
};
