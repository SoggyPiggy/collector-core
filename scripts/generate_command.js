/* eslint-disable no-console */
import { join } from 'path';
import fs from 'fs';

const parts = process.argv.slice(2, Infinity);
const title = parts.map((part) => part[0].toUpperCase() + part.slice(1, Infinity).toLowerCase());
const name = parts.join('_').toLowerCase();
const file = join(process.cwd(), './src/commands/commands/', `${name}.js`);
fs.writeFile(file,
  `import Command from '../Command';

const execute = async function executeCommand({ message, account }) {
};

const command = new Command({
  id: '${name}',
  title: '${title}',
  description: '',
  aliases: ['${name}'],
  onExecute: execute,
});

export default command;
`, { flag: 'wx' }, console.warn);
