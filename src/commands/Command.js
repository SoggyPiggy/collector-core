/**
 * Options for a Command.
 * @typedef {Object} CommandOptions
 * @property {string} [id] The unique id of the command
 * @property {string} [category] The name of the category the command belongs to
 * @property {string} [title] The name of the command
 * @property {string} [description] An explanation of the commands use
 * @property {string[]} [aliases] The command aliases used to match user messages
 * @property {string[]} [examples] Some examples of the command being used
 * @property {boolean} [isPublic] Whether the command has access to non-admins
 * @property {boolean} [registeredAccess] Whether the command can be accessed by registered users
 * @property {boolean} [unregisteredAccess] Whether the command can be accessed by non-registered
 * users
 * @property {string[]} [argsStrict] The arg's main name
 * @property {string[]} [argsAliases] The arg's aliases
 * @property {string[]} [argsDescriptions] The arg's description
 * @property {function} [onExecute] The function that will be called when a command's execute
 * function is called
 */

export default class Command {
  /**
   * @param {CommandOptions} [options] Options for the Command
   */
  constructor(options = {}) {
    this.id = 'undefined';
    this.category = 'Undefined';
    this.title = 'Undefined';
    this.description = 'Undefined';
    this.aliases = [];
    this.examples = [];
    this.isPublic = true;
    this.registeredAccess = true;
    this.unregisteredAccess = false;
    this.argsStrict = [];
    this.argsAliases = [];
    this.argsDescriptions = [];
    this.onExecute = async () => {};
    Object.assign(this, options);
  }

  execute(...data) { return this.onExecute(...data); }
}
