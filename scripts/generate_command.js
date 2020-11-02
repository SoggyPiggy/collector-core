/* eslint-disable no-console */
import generator from '../src/commands/generator';

generator(process.argv.slice(2, Infinity).join(' '))
  .catch(console.warn)
  .then(console.log);
