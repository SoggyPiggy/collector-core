import { join } from 'path';
import fs from 'fs';

const generateCommand = async function generateCommandFile(data) {
  const parts = data.split(' ');
  const title = parts.map((part) => part[0].toUpperCase() + part.slice(1, Infinity).toLowerCase());
  const name = parts.join('_').toLowerCase();
  const file = join(process.cwd(), './src/commands/commands/', `${name}.js`);
  return new Promise((resolve, reject) => {
    fs.writeFile(file,
      `import Command from '../Command';
       import CollectorError from '../../error';
        
        const execute = async function executeCommand() {
          throw new CollectorError('Command execute function not defined');
        };
        
        const command = new Command({
          id: '${name}',
          title: '${title}',
          description: '',
          aliases: ['${name}'],
          examples: ['${name}'],
          onExecute: execute,
        });
        
        export default command;
        `.replace(/^ {8}/gm, ''), { flag: 'wx' }, (error) => {
        if (error) reject(error);
        else resolve(`Command file generated: ${file}`);
      });
  });
};

export default generateCommand;
