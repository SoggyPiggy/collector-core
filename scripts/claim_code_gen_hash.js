/* eslint-disable no-console */
import { generateHash } from '../src/utils';

const code = process.argv[2];
console.log(`${code} ==> ${generateHash(code)}`);
process.exit();
