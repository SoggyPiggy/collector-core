import levenshtein from 'fast-levenshtein';
import client from '../discord';
import CollectorError from '../error';
import { Account } from '../structures';

const getByDiscordID = async function getAccountFromDiscordUserID(resolveable) {
  if (!resolveable.match(/^(?:<@!?)?\d+(?:>)?$/g)) return undefined;
  const id = resolveable.replace(/^(?:<@!?)?(\d+)(?:>)?$/g, '$1');
  const user = await client.users.fetch(id);
  if (user) return Account.getByDiscordUser(user);
  return undefined;
};

const getByLevenshtein = async function getAccountBasedOnLevenshteinDistance(resolveable) {
  let smallestDistance = Infinity;
  const accounts = await Account.all({ discordID: { $ne: null } });
  const users = await Promise.all(accounts.map((account) => client.users.fetch(account.discordID)));
  const [foundUser] = users.map((user) => {
    const distance = levenshtein.get(user.username, resolveable);
    smallestDistance = smallestDistance < distance ? smallestDistance : distance;
    return [user, distance];
  }).find(([, distance]) => distance === smallestDistance);
  if (foundUser) return Account.getByDiscordUser(foundUser);
  return undefined;
};

const accountResolver = async function accountResolver(resolveable) {
  let account;
  account = await getByDiscordID(resolveable);
  if (typeof account !== 'undefined' && account !== null) return account;
  account = await getByLevenshtein(resolveable);
  if (typeof account !== 'undefined' && account !== null) return account;
  throw new CollectorError(`Unable to resolve account: ${resolveable}`);
};
export default accountResolver;
