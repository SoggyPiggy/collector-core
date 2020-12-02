import { join } from 'path';
import fs from 'fs';

const map = new Map();
const path = join(process.cwd(), '/src/claims/claims/');
export default new Promise((resolve) => {
  Promise.all(fs.readdirSync(path).map((file) => import(join(path, file)))).then((modules) => {
    modules.forEach((module) => {
      map.set(module.hash, module.default);
    });
    resolve(map);
  });
});
