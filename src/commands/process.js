import { findCommand, getList } from './organiser';

/**
 * Splits a string along the spaces but keeps words wrapped with "" together
 * @param {string} input The string to be regex split
 * @returns {string[]}
 */
export const split = function splitStringIntoComponents(input) {
  const parts = [];
  const regex = new RegExp('(?:["]((?:\\S| )+)["])|(\\S+)', 'g');
  let match = null;
  do {
    match = regex.exec(input);
    if (match !== null) {
      if (match[1]) parts.push(match[1]);
      else if (match[2]) parts.push(match[2]);
    }
  } while (match !== null);
  return parts;
};

/**
 * Processes the input for a possible command and executes
 * @param {String} input The modified message content from a user
 * @param {Message} message The discord message
 */
export const process = async function processInputForCommand(input, account) {
  const [inputCommand, ...inputArguments] = split(input);
  const command = findCommand(inputCommand, getList(account));
  if (typeof command === 'undefined') throw new Error(`Command not found: ${inputCommand}`);
  return command.execute({
    input,
    inputCommand,
    inputArguments,
    account,
  });
};

export default process;
