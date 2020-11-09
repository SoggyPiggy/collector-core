import dashdash from 'dashdash';

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
 * @property {CommandArgumentOptions[]} [arguments] The options that will be used to create the
 * parser
 * @property {function} [onExecute] The function that will be called when a command's execute
 * function is called
 */

/**
 * Options for a Command Argument.
 * @typedef {Object} CommandArgumentOptions
 * @property {stritng} [name] Give the option name. The name is the key for the parsed opts object
 * @property {stritng[]} [names] These give the option name and aliases. The first name is the key
 * for the parsed opts object
 * @property {string|'bool'|'string'|'number'|'integer'|'positiveInteger'|'date'|'arrayOfBool'|
 * 'arrayOfString'|'arrayOfNumber'|'arrayOfInteger'|'arrayOfPositiveInteger'|'arrayOfDate'} [type]
 * The type the option should be
 * @property {*} [default] A default value used for this option, if the option isn't specified in
 * argv.
 * @property {string} [completionType] This is used for Bash completion for an option argument.
 * If not specified, then the value of type is used.
 * @property {string|string[]} [env] An environment variable name (or names) that can be used as a
 * fallback for this option.
 * @property {string} [help] Used for parser.help() output.
 * @property {string} [helpArg] Used in help output as the placeholder for the option argument.
 * @property {boolean} [helpWrap] Default true. Set this to false to have that option's help not be
 * text wrapped in <parser>.help() output.
 * @property {boolean} [hidden] Default false. If true, help output will not include this option.
 * See also the includeHidden option to bashCompletionFromOptions() for Bash completion.
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
    this.arguments = [];
    this.onExecute = async () => {};
    Object.assign(this, options);

    this.parser = dashdash.createParser({ options: this.arguments });
  }

  execute(...data) { return this.onExecute(...data); }

  parseArgs(args) {
    return this.parser.parse(['', '', ...args]);
  }
}
