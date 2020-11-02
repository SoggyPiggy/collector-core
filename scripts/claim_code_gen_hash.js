/* eslint-disable no-console */
import { generateHash } from '../src/commands/commands/claim';

const code = process.argv[2];
console.log(`${code} ==> ${generateHash(code)}`);
