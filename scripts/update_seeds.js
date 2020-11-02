/* eslint-disable no-console */
import { update } from '../src/database/seeds';

update()
  .catch(console.warn)
  .then(console.log);
