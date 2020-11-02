/* eslint-disable no-console */
import { update } from '../src/database/seeds';

update()
  .catch(console.warn)
  .then((...data) => {
    console.log(...data);
    process.exit();
  });
