/* eslint-disable no-console */
import { generate } from '../src/database/seeds';

generate(process.argv.slice(2, Infinity).join(' '))
  .catch(console.warn)
  .then(console.log);
